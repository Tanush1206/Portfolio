# Ask My Portfolio — decisions of record

The two source documents are at [ASK_MY_PORTFOLIO_SPEC.md](ASK_MY_PORTFOLIO_SPEC.md) and
[CLAUDE_CODE_PROMPT.md](CLAUDE_CODE_PROMPT.md), reconstructed after the originals were lost to a
context compaction. They are the authority on *what* is being built; this file records *why*
the open questions were settled the way they were.

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
Subset to the used codepoints: 2.2 KB woff2, down from 22 KB. IBM Plex Mono stays in the
family declaration as fallback. License shipped at `public/fonts/DepartureMono-LICENSE.txt`.

It sits **outside** the 12/14/16/20/28/44/72 type scale, at 11px and 22px only. The scale
governs Bricolage Grotesque and Newsreader — outline faces that resample cleanly to any
size. Departure Mono is drawn on an 11px pixel grid: at 12px each font-pixel maps to 1.09
device pixels and the face goes soft. So the scale governs the two faces it was written
for, and the pixel font keeps its grid. Mono is utility text only — coordinates, cosine
scores, telemetry, labels.

**`--query` is reserved.** Query node, retrieval beams, citation chips, and nothing else.
The reservation is stated as a comment in both `index.css` and `scene/palette.ts`, at the
two places someone would reach for it. It is not a hover colour, not a focus ring, not an
"active" state — if a UI state needs emphasis the answer is `--ivory` or `--muted` at a
different alpha.

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

**34 skills against 8 projects.** Projects dominate via larger base scale and being the
only nodes emissive at rest. Skill hues are desaturated 55% toward `--muted`.

That 55% is a ceiling, not a starting point. Pushing further does separate skills from
projects, but it also collapses the three cluster hues toward the same grey, and at
full-cloud distance the legend then corresponds to nothing on screen. If ml-teal and
eng-violet start reading as the same colour, stop: the remaining lever is size or opacity,
not more chroma loss.

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

## Tailwind cannot alpha a hex `var()`

`bg-panel/95` against a colour defined as a bare `var(--panel)` holding a hex string emits
**nothing** — not 95%, not an opaque fallback, no background declaration at all. Every overlay
panel rendered fully transparent from the first commit, and the symptom read as bloom bleed, so
the first fix targeted the wrong cause and did not work.

Custom properties therefore hold **RGB channel triples** and the Tailwind config wraps them as
`rgb(var(--token) / <alpha-value>)`. Any new colour token must follow that form or it will fail
the same silent way.

## Phase 2 measurements

Cold model load ~11–14 s on a headless SwiftShader run; warm embed **10 ms**, cold **47 ms**.
Comfortably under the ~150 ms threshold at which the query node would need to materialise
before the beams rather than with them, so both land together.

Browser-vs-bake projection drift for a corpus node's own text: **0.12 scene units** on a cloud
spanning roughly 24, with the query vector's L2 norm exactly 1.0. That residual is int8
quantisation in the ONNX graph against fp32 PyTorch in the bake, not a projection error — a
transposed matmul misses by scene units, not hundredths. fp32 weights would cut it to near zero
at roughly four times the download, which is not worth it.

## Skills outrank projects, and it is not dilution

For "what have you built with retrieval?" the top three hits are all skill nodes; the
`RAG_BASED_AI` project sits fourth at 0.329.

The obvious explanation — that a project's vector is diluted across six chunks plus tech and
blurb while a skill node is short and topically pure — was **tested and is wrong**. Scoring
against the best individual chunk instead of the node gives `RAG_BASED_AI` 0.330 against the
node-level 0.329, and reranks the rest *worse* (a degree entry and a bare `Python` node climb
into the top six). Chunk-level vectors would cost ~200 KB and buy nothing here.

The actual cause is that a skill node titled "Retrieval Evaluation" is a near-literal match
for a query about retrieval, while a paragraph describing a build is not. Cosine similarity
measures topical proximity; "what have you *built*" is an intent, and MiniLM has no way to
tell those apart.

**Left as it is, deliberately.** The answer text is substantively correct — the quoted chunks
are real descriptions of retrieval work — and only the citation *labels* name skills rather
than the project. Fixing it means a type prior boosting projects and experience above skills,
which is defensible for a portfolio but stops the scores being pure cosine and would require
the answer panel's footer to stop saying they are. That is a product call, not a bug fix.

## Relative retrieval floor

`HIT_FLOOR` alone plus a fixed `TOP_K` returned five results whether or not five were any
good. Results must now also clear 70% of the top hit's score, so weak tails fall off on their
own instead of a fixed number being tuned to suit one query.

## Scores stay pure cosine — no type prior, no reranking

Given the finding above, the obvious product fix is a prior that boosts projects and
experience above skills. **Rejected**, for three reasons in order of weight.

The site's whole claim is that nothing is hand-placed and the numbers are real. A type prior
is a thumb on the scale, and the moment the answer footer has to read "cosine, adjusted", the
demo becomes an ordinary portfolio with a nice graph. That trades the one property nothing
else here has for slightly tidier citation labels.

The behaviour is the system being honest about a real limitation, not a defect. Dense
retrieval matches topic; "what have you built" is an intent. That gap is a well-known result,
and someone who knows retrieval reads it as the system working correctly.

And it is a better story told than hidden, so it is stated outright in the "How this works"
panel rather than engineered around.

The legitimate lever, if the project should surface, is the **corpus, not the ranking**:
`RAG_BASED_AI`'s chunks may simply not contain build-intent language. Rewriting a chunk to say
what was built and why changes the input, which is fair; changing the metric is not.

## A dependency-less rAF effect must not be gated on a conditional render

`CitationLines` returned `null` until the first answer arrived. Its rAF loop lives in a
`useEffect` with `[]` dependencies **on purpose** — it must not tear down and restart on every
render — so it ran exactly once, against a `ref` that was still `null`, and never again. Lines
never drew, with no error anywhere.

The element is now always mounted and simply inert when there is nothing to point at. Any
long-lived imperative loop keyed to a ref has this trap: if the component can render `null`,
the effect's one and only run may land on nothing.
