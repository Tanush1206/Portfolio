# Ask My Portfolio — decisions of record

> **The two source documents (`ASK_MY_PORTFOLIO_SPEC.md`, `CLAUDE_CODE_PROMPT.md`) are
> not in this repo.** They were pasted into a chat session and the raw text was lost to a
> context compaction — it is not recoverable from any transcript on disk. Paste both into
> `docs/` when convenient; until then this file is the working authority, and everything
> in it is either quoted verbatim from surviving messages or marked as a derivation.
>
> **What the missing spec costs right now:** the exact palette values and the type scale.
> The instruction was "do not deviate from the spec palette or typefaces." Phase 1 defines
> every colour as a CSS custom property in one block at the top of `src/index.css`, so
> restoring the real values is an edit to that block and nothing else. The typeface is
> settled and correct — Departure Mono, self-hosted, with IBM Plex Mono as fallback.

## Standing constraints (verbatim)

- Do not invent metrics, links, or achievements in the corpus.
- Do not use `OrbitControls`. Write the damped camera rig described in the spec.
- Do not hand-place any node position. Every coordinate comes from the bake.
- Do not call an embedding API at runtime. Everything is baked or in-browser.
- Do not use `localStorage` for the model cache — use IndexedDB via the transformers.js cache.
- Do not deviate from the spec palette or typefaces. If something doesn't work visually,
  say so and propose a change rather than silently substituting.
- Section 2: no skybox, no grid, no floor.
- Stop at the end of each phase, report what is runnable, and wait for confirmation.
- Model parity between `sentence-transformers/all-MiniLM-L6-v2` (bake) and
  `Xenova/all-MiniLM-L6-v2` (browser) is non-negotiable.

## Resolved

**Vite, not Next.js.** The spec named Next 14 App Router; the repo is Vite + react-router
and deploys via gh-pages/Netlify. Nothing in the feature set needs Next — it is a static
export with zero backend. Vite additionally gives first-class module Web Workers with no
config, and avoids onnxruntime wasm-asset friction under Next static export.

**PCA, not UMAP — forced, not preferred.** The query node must materialise at its true
embedded position, which requires projecting a fresh 384-d vector into the same 3D space
in the browser. PCA is a mean subtraction and a 3×384 matmul. UMAP has no closed-form
out-of-sample transform; the query's position could only be faked by averaging its
neighbours' coordinates, which would invert the exact claim the legend makes.

**Acceptance test is neighbourhood retention @5, not explained variance.** Variance asks
how much of the embedding survived projection — always small for sentence vectors, always
alarming, and not what the visitor experiences. Retention asks whether on-screen proximity
means what it claims. Current: mean 0.538, median 0.600 (threshold 0.50).

**Departure Mono, self-hosted.** SIL Open Font License 1.1, which permits web embedding.
Subset to the used codepoints: 2.2 KB woff2, down from 22 KB. Native design size is 11px —
pin to 11/22/33px, never arbitrary sizes, or the pixel grid goes mushy. IBM Plex Mono
stays in the family declaration as fallback. License shipped at
`public/fonts/DepartureMono-LICENSE.txt`.

**Min-degree 1, drawn dimmed and dashed.** Nine of 45 nodes fall below the 0.42 edge
threshold against everything in the corpus — generic tooling nobody wrote a paragraph
about. Lowering the threshold would inflate every other node's connections to hide nine
floaters. Instead each orphan gets its single strongest link, marked `forced: true`, drawn
at lower opacity with a dashed stroke, and the legend states plainly that dashed links
fall below threshold and exist only so nothing floats.

**Screen positions never enter zustand.** A 45-entry position map written at 60 Hz would
re-render the UI tree continuously. `NodeCloud` writes into a module-level `Float32Array`
(`src/scene/screen.ts`); consumers read it in their own rAF and set attributes
imperatively. The one frame of staleness this can introduce is 16 ms and invisible.

**`camTarget` is one-way.** The store holds the camera's target; the rig reads it and
eases internally, and never writes back.

## Store shape (approved, with the four amendments)

- `modelStatus` and `queryStatus` are separate enums. A single enum cannot represent
  "model at 60% AND a query is queued", which is the state a visitor creates by typing
  before the lazy model load finishes. `queryStatus: 'queued'` is what lets the query be
  accepted, shown pending, and run the moment `modelStatus` reaches `ready` — instead of
  blocking the input or dropping the submission.
- `hoveredNode` is separate from `activeHit`. Hovering a node in 3D and having a result
  selected are different states; collapsing them makes the tooltip and the detail card
  fight each other.
- Answer segments carry `cites?: string[]`, not a single id. An extractive sentence
  stitched from two chunks cites two nodes.

## Deferred to Phase 4

- The "How this works" pipeline panel.
- Cluster halos.

## Open

**34 skills against 8 projects.** Projects currently dominate via larger base scale and
being the only nodes emissive at rest. If that still reads as a skill list with projects
buried in it, the next lever is desaturating skill hues toward `--muted` and reserving
full cluster chroma for projects — *not* scaling projects up further.

**`ml` ↔ `eng` overlap.** Centroid separation 10.03 against summed spreads of 10.77, so
the two lobes bleed. This is left as it is and stated in the legend: RAG and serving
infrastructure overlap because in practice they do.

**`eng` is n=21 with spread 6.52** — nearly half the corpus in the loosest cluster. If it
looks diffuse next to the tight `data` lobe, that is a signal the cluster covers too much
semantic ground, and the fix is splitting it into `infra` and `frontend` in the corpus,
not tuning the layout.

## v1 archive

The previous terminal-themed portfolio is preserved three ways: git tag `v1-terminal-ui`,
the `legacy/v1-terminal-ui/` directory, and history on `main`.
