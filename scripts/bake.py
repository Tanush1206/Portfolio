#!/usr/bin/env python3
"""
Offline embedding bake for Ask My Portfolio.

Run once, commit the output. The corpus is NEVER embedded at runtime — the
browser only ever embeds the visitor's query and dots it against these vectors.

    python3 scripts/bake.py

Writes:
    public/data/layout.json   nodes with 3D positions + the edge list
    public/data/vectors.bin   raw Float32Array, N x 384, L2-normalised

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
    coords = pca.fit_transform(vecs)
    coords = coords / np.abs(coords).max() * SCENE_SCALE
    var = pca.explained_variance_ratio_
    print(f"PCA explained variance: {var[0]:.3f} / {var[1]:.3f} / {var[2]:.3f}"
          f"  (total {var.sum():.3f})")

    # Full similarity matrix — the corpus is tiny, so an exact scan beats any
    # index and keeps the numbers auditable.
    sim = vecs @ vecs.T
    edges = [
        [i, j, round(float(sim[i, j]), 4)]
        for i in range(len(corpus))
        for j in range(i + 1, len(corpus))
        if sim[i, j] > EDGE_THRESHOLD
    ]
    print(f"edges: {len(edges)} above cosine {EDGE_THRESHOLD}")

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
                "nodes": nodes,
                "edges": edges,
            },
            indent=1,
        )
    )
    vecs.tofile(OUT_DIR / "vectors.bin")

    layout_kb = (OUT_DIR / "layout.json").stat().st_size / 1024
    vectors_kb = (OUT_DIR / "vectors.bin").stat().st_size / 1024
    print(f"wrote public/data/layout.json  {layout_kb:6.1f} KB")
    print(f"wrote public/data/vectors.bin  {vectors_kb:6.1f} KB")

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

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
