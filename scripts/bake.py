#!/usr/bin/env python3
"""
Offline embedding bake for Ask My Portfolio.

Run once, commit the output. The corpus is NEVER embedded at runtime — the
browser only ever embeds the visitor's query and dots it against these vectors.

    python3 scripts/bake.py

Writes:
    public/data/layout.json      nodes with 3D positions + the edge list
    public/data/vectors.bin      raw Float32Array, N x 384, L2-normalised
    public/data/projection.bin   the PCA basis: mean(384) then components(3x384)

The projection basis is what lets the browser place the visitor's query at its
TRUE embedded position rather than guessing it from its neighbours:

    pos = ((q - mean) @ components.T) * scale

That is the entire reason this is PCA and not UMAP. UMAP has no closed-form
out-of-sample transform, so a query node could only be faked by averaging the
coordinates of whatever it retrieved — which would quietly invert the claim the
legend makes. The query must earn its position the same way the corpus did.

MODEL PARITY IS NON-NEGOTIABLE. This script uses
`sentence-transformers/all-MiniLM-L6-v2`; the browser uses
`Xenova/all-MiniLM-L6-v2`. Same weights, same tokeniser. If they ever diverge,
the query lands in the wrong region of the cloud and every retrieval is wrong.
"""

from __future__ import annotations

import json
import pathlib
import sys

import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.decomposition import PCA

ROOT = pathlib.Path(__file__).resolve().parent.parent
CORPUS_PATH = ROOT / "data" / "corpus.json"
OUT_DIR = ROOT / "public" / "data"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
EDGE_THRESHOLD = 0.42          # cosine below this is noise, not a connection
SCENE_SCALE = 12.0             # PCA output is unitless; scale into scene units
RETENTION_K = 5                # neighbourhood retention @ K — the go/no-go stat


def embedding_text(node: dict) -> str:
    """
    One string per node. Title and blurb carry the topic; chunks carry the
    specifics. Chunks are what get cited later, so they must be inside the
    vector that positions the node — otherwise a node could sit far from the
    very text it is quoted for.
    """
    parts = [node["title"], node.get("blurb", "")]
    parts.extend(node.get("chunks", []))
    parts.extend(node.get("tech", []))
    return ". ".join(p for p in parts if p)


def neighbourhood_retention(vecs: np.ndarray, coords: np.ndarray, k: int) -> np.ndarray:
    """
    Per-node overlap between the top-k neighbours in 384-d and the top-k in 3D.

    This — not explained variance — is the number that says whether the cloud can
    be trusted. Explained variance asks "how much of the embedding survived the
    projection", which is always small and always alarming for sentence vectors.
    Retention asks the question the visitor actually experiences: when two nodes
    look close on screen, are they close in the space the retrieval runs in?
    """
    n = len(vecs)
    hi = vecs @ vecs.T                                    # cosine; vecs are unit
    d = coords[:, None, :] - coords[None, :, :]
    lo = -np.einsum("ijk,ijk->ij", d, d)                  # negated sq. distance
    np.fill_diagonal(hi, -np.inf)
    np.fill_diagonal(lo, -np.inf)

    top_hi = np.argsort(-hi, axis=1)[:, :k]
    top_lo = np.argsort(-lo, axis=1)[:, :k]
    return np.array([len(set(top_hi[i]) & set(top_lo[i])) / k for i in range(n)])


def main() -> int:
    if not CORPUS_PATH.exists():
        print(f"✗ missing {CORPUS_PATH.relative_to(ROOT)}", file=sys.stderr)
        return 1

    corpus = json.loads(CORPUS_PATH.read_text())
    print(f"corpus: {len(corpus)} nodes")

    model = SentenceTransformer(MODEL_NAME)
    texts = [embedding_text(n) for n in corpus]

    # normalize_embeddings=True is what lets the browser treat cosine as a
    # plain dot product — cheaper, and it removes a whole class of bug.
    vecs = model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
    vecs = np.asarray(vecs, dtype=np.float32)
    print(f"vectors: {vecs.shape}  (norm min={np.linalg.norm(vecs, axis=1).min():.4f})")

    # PCA, not UMAP: deterministic, no extra dependency, and explainable when
    # someone asks how the positions were derived.
    pca = PCA(n_components=3, random_state=0)
    raw = pca.fit_transform(vecs)
    scale = float(SCENE_SCALE / np.abs(raw).max())
    coords = raw * scale
    var = pca.explained_variance_ratio_
    print(f"PCA explained variance: {var[0]:.3f} / {var[1]:.3f} / {var[2]:.3f}"
          f"  (total {var.sum():.3f})  — context only, not the acceptance test")

    # Prove the exported basis reproduces the bake exactly. If this drifts, every
    # query node lands somewhere subtly wrong and nothing on screen says so.
    replay = ((vecs - pca.mean_) @ pca.components_.T) * scale
    drift = float(np.abs(replay - coords).max())
    print(f"projection replay drift: {drift:.3e} scene units")
    assert drift < 1e-3, "exported PCA basis does not reproduce the baked coords"

    # Full similarity matrix — the corpus is tiny, so an exact scan beats any
    # index and keeps the numbers auditable.
    sim = vecs @ vecs.T
    edges = [
        {"a": i, "b": j, "w": round(float(sim[i, j]), 4), "forced": False}
        for i in range(len(corpus))
        for j in range(i + 1, len(corpus))
        if sim[i, j] > EDGE_THRESHOLD
    ]
    print(f"edges: {len(edges)} above cosine {EDGE_THRESHOLD}")

    # Min-degree 1. Nine nodes sit below threshold against everything — generic
    # tooling nobody wrote a paragraph about. Rather than lowering the threshold
    # (which would inflate every other node's connections to hide nine floaters),
    # give each orphan its single strongest link and mark it forced. The renderer
    # draws these dimmed and dashed and the legend says why, so 0.42 keeps
    # meaning what it says.
    linked = {i for e in edges for i in (e["a"], e["b"])}
    orphans = [i for i in range(len(corpus)) if i not in linked]
    masked = sim.copy()
    np.fill_diagonal(masked, -np.inf)
    for i in orphans:
        j = int(np.argmax(masked[i]))
        a, b = min(i, j), max(i, j)
        edges.append({"a": a, "b": b, "w": round(float(sim[i, j]), 4), "forced": True})
    print(f"forced: {len(orphans)} min-degree links "
          f"(weakest {min((e['w'] for e in edges if e['forced']), default=0):.3f})")

    nodes = [{**n, "pos": [round(float(c), 4) for c in coords[i]]}
             for i, n in enumerate(corpus)]

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "layout.json").write_text(
        json.dumps(
            {
                "model": MODEL_NAME,
                "dims": int(vecs.shape[1]),
                "edgeThreshold": EDGE_THRESHOLD,
                "sceneScale": SCENE_SCALE,
                # How to read projection.bin: float32, mean first, then the three
                # components row-major. Kept binary rather than inlined as JSON
                # so the browser reproduces the bake bit-for-bit — rounding the
                # basis to text would nudge every query node off its true spot.
                "projection": {
                    "file": "projection.bin",
                    "layout": "float32: mean[dims], components[3][dims]",
                    "scale": scale,
                },
                "nodes": nodes,
                "edges": edges,
            },
            indent=1,
        )
    )
    vecs.tofile(OUT_DIR / "vectors.bin")

    np.concatenate([
        pca.mean_.astype(np.float32),
        pca.components_.astype(np.float32).reshape(-1),
    ]).tofile(OUT_DIR / "projection.bin")

    for name in ("layout.json", "vectors.bin", "projection.bin"):
        kb = (OUT_DIR / name).stat().st_size / 1024
        print(f"wrote public/data/{name:<14} {kb:6.1f} KB")

    # ── cluster sanity check ──
    # If the lobes don't separate here, they won't separate on screen either,
    # and the whole "positions are earned" claim falls over.
    print("\ncluster centroids (scene units):")
    for cluster in ("ml", "eng", "data"):
        idx = [i for i, n in enumerate(corpus) if n.get("cluster") == cluster]
        if not idx:
            continue
        centroid = coords[idx].mean(axis=0)
        spread = float(np.linalg.norm(coords[idx] - centroid, axis=1).mean())
        print(f"  {cluster:<5} n={len(idx):<3} "
              f"[{centroid[0]:7.3f} {centroid[1]:7.3f} {centroid[2]:7.3f}]  "
              f"mean spread {spread:5.2f}")

    print("\npairwise centroid separation:")
    names = [c for c in ("ml", "eng", "data")
             if any(n.get("cluster") == c for n in corpus)]
    cents = {
        c: coords[[i for i, n in enumerate(corpus) if n.get("cluster") == c]].mean(axis=0)
        for c in names
    }
    for a in range(len(names)):
        for b in range(a + 1, len(names)):
            d = float(np.linalg.norm(cents[names[a]] - cents[names[b]]))
            print(f"  {names[a]:<5} ↔ {names[b]:<5} {d:6.3f}")

    # ── the acceptance test ──
    ret = neighbourhood_retention(vecs, coords, RETENTION_K)
    print(f"\nneighbourhood retention @{RETENTION_K}: "
          f"mean {ret.mean():.3f}  median {np.median(ret):.3f}  "
          f"min {ret.min():.3f}  (>= 0.50 means the geometry is trustworthy)")
    for cluster in names:
        idx = [i for i, n in enumerate(corpus) if n.get("cluster") == cluster]
        print(f"  {cluster:<5} {ret[idx].mean():.3f}")

    worst = np.argsort(ret)[:4]
    print("weakest nodes (3D neighbours least like their 384-d neighbours):")
    for i in worst:
        print(f"  {ret[i]:.2f}  {corpus[i]['title']}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
