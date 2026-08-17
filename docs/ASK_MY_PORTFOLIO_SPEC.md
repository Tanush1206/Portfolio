# Ask My Portfolio — specification

> **Provenance.** The original document was lost to a context compaction. This is a
> reconstruction from the surviving decision record plus the palette and type scale supplied
> verbatim afterwards. Where the original wording survives it is quoted; where it does not,
> the substance is preserved and the section is written to be the authority going forward.
> Treat this file, not conversation memory, as the spec.

## 1. The idea

The portfolio *is* a retrieval system, not a page about one.

A visitor types a question. It is embedded in their browser. A 3D point cloud — every node
positioned by its own embedding — reorganises to show what was retrieved, and the answer
carries citations that draw back to the exact points in space they came from.

The claim the whole thing rests on: **positions are earned, not designed.** Nothing in the
cloud is hand-placed. If that stops being true the piece is a decorative graph and the
interesting part is gone.

## 2. The scene

A latent space. Not a solar system, not a network diagram, not a room.

- **No skybox. No grid. No floor.** A grid plane is the single most recognisable three.js
  default and it makes the scene read as templated regardless of what else is right.
- The backdrop is a radial gradient, dark at the edges, lifting slightly at the centre.
- Ambient drift particles occupy the same volume as the cloud and move slowly, so the space
  reads as a volume and parallax gives depth.
- Camera is a hand-written damped orbit rig. **Do not use `OrbitControls`.** It must ease
  toward a target the application nominates and keep a slow idle drift when untouched.
- Under 10 draw calls.

## 3. The corpus

Nodes are projects, experience entries, and skills. Each carries a title, a blurb, a set of
chunks (the quotable sentences), a tech list, metrics, and links.

**Do not invent metrics, links, or achievements.** Every number in the corpus must trace to
something real.

Chunks are what get cited, so chunks must be inside the vector that positions the node —
otherwise a node can sit far from the very text it is quoted for.

## 4. Layout

Positions come from an offline bake: embed every node, run PCA to three components, scale
into scene units. Committed as artifacts, never computed at runtime.

**PCA, not UMAP — and this is forced, not preferred.** The query node must materialise at its
true embedded position, which requires projecting a fresh 384-dimensional vector into the
same 3D space in the browser. PCA is a mean subtraction and a 3×384 matmul. UMAP has no
closed-form out-of-sample transform; the query could only be placed by averaging the
coordinates of what it retrieved, which would make it sit reassuringly in the middle of its
own results and prove nothing.

The bake therefore exports the basis — mean and components — as float32 binary, and asserts
that replaying it reproduces the baked coordinates before writing anything.

**Acceptance test: neighbourhood retention @5**, not explained variance. Variance asks how
much of the embedding survived projection; it is always small for sentence embeddings and
tells you nothing a visitor experiences. Retention asks whether two nodes that look close on
screen are close in the space retrieval actually runs in. Threshold 0.50.

Edges are cosine similarity above 0.42. Nodes that clear that bar against nothing get a single
forced link to their strongest neighbour, drawn dimmed and dashed, with the legend stating
plainly that dashed links fall below threshold and exist only so nothing floats.

## 5. Retrieval

- The model is `all-MiniLM-L6-v2`. **Model parity between the bake
  (`sentence-transformers/…`) and the browser (`Xenova/…`) is non-negotiable.** If they
  diverge the query lands in the wrong region and every retrieval is confidently wrong with
  nothing on screen saying so.
- Embedding runs in a Web Worker, off the main thread.
- **Never call an embedding API at runtime.** Everything is baked or in-browser.
- Weights cache via the transformers.js cache (Cache API / IndexedDB). **Never
  `localStorage`** — the model is ~23 MB and localStorage is a ~5 MB synchronous string store.
- Vectors are L2-normalised on both sides, so cosine is a plain dot product.
- The model loads lazily and the query bar stays live throughout. A query submitted before
  the model is ready is **held and promoted automatically**, never blocked and never dropped.

## 6. Answer and citations

Answers are extractive — assembled from retrieved chunks, not generated. Each sentence may
cite more than one node.

Citation chips draw SVG lines to the 3D screen positions of the nodes they came from. Screen
positions are published to a plain buffer read in its own rAF; they must never pass through
application state at frame rate.

## 7. Stack

Vite + React + TypeScript + Tailwind, react-three-fiber, drei, postprocessing, zustand.
Static build, zero backend.

> The original named Next.js 14. Superseded: nothing in the feature set needs it, Vite gives
> first-class module workers with no config, and Next static export has real friction with
> onnxruntime's wasm assets.

## 8. Palette

Eight colours. Nothing else.

| Token | Value | Use |
| --- | --- | --- |
| `--void` | `#0B0E14` | canvas background |
| `--panel` | `#141A24` | answer panel, cards, legend |
| `--ivory` | `#E8E4DA` | primary text |
| `--muted` | `#7C8798` | labels, metadata, scores |
| `--cluster-ml` | `#6EE7DC` | AI/ML + NLP lobe |
| `--cluster-eng` | `#A78BFA` | full-stack / infra lobe |
| `--cluster-data` | `#F0B429` | data / analytics lobe |
| `--query` | `#FF5E5B` | query node, beams, citation chips |

**`--query` is reserved.** Query node, retrieval beams, citation chips — nothing else, ever.
The moment it appears on a hover state or a focus ring it stops meaning "this is you" and the
colour story collapses. Borders are `--muted` at low alpha rather than a ninth token.

## 9. Type

Scale: **12 / 14 / 16 / 20 / 28 / 44 / 72**. One hero size only.

- **Display** — Bricolage Grotesque, variable. The width axis goes wide on the hero line only.
- **Body** — Newsreader.
- **Utility** — Departure Mono, self-hosted, SIL OFL, subset.

Departure Mono is exempt from the scale and runs at 11px or 22px. It is drawn on an 11px
pixel grid; at 12px each font-pixel maps to 1.09 device pixels and the face goes soft. The
scale governs the two outline faces, which resample cleanly. Mono is utility text only —
coordinates, cosine scores, telemetry, labels.

## 10. Degradation

No WebGL means a text version of the same corpus, not a 2D scatter plot. A flattened
projection of a projection communicates almost nothing; the corpus as prose is genuinely
readable and needs no dependencies. This is also what crawlers and screen readers get.
