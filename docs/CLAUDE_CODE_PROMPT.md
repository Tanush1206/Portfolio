# Build instructions

> **Provenance.** Reconstructed after the original was lost to a context compaction. The
> constraint list is quoted verbatim from surviving messages; the phase breakdown is
> reconstructed. See `ASK_MY_PORTFOLIO_SPEC.md` for what is being built and `DECISIONS.md`
> for what has been settled since.

## Hard constraints

- Do not invent metrics, links, or achievements in the corpus.
- Do not use `OrbitControls`. Write the damped camera rig described in the spec.
- Do not hand-place any node position. Every coordinate comes from the bake.
- Do not call an embedding API at runtime. Everything is baked or in-browser.
- Do not use `localStorage` for the model cache — use IndexedDB via the transformers.js cache.
- Do not deviate from the spec palette or typefaces. If something doesn't work visually, say
  so and propose a change rather than silently substituting.
- Model parity is non-negotiable.

## Working method

Build in phases. **Stop at the end of each one**, report what is runnable, and wait for
confirmation before starting the next. Do not build several in one pass.

Before writing components, show the component skeleton and the store shape and get them
approved.

Report honestly. If a check fails, show the output. If something was skipped, say so. Never
report a number that was not measured — an em dash beats a plausible zero.

## Phases

**Phase 0 — corpus and bake.** Build the corpus, embed it offline, run PCA, export the
layout, the vectors, and the projection basis. Report the coordinates and the cluster
geometry. *Complete.*

**Phase 1 — the cloud.** Scene, damped rig, instanced nodes, edges, legend, node detail, and
the text fallback route. No retrieval yet. *Complete.*

**Phase 2 — retrieval.** Embedding worker, out-of-sample projection of the query, top-k
scan, the query node, retrieval beams, and dimming of everything that was not retrieved.
*Complete.*

**Phase 3 — answer and citations.** Extractive answer assembly from retrieved chunks,
citation chips, and the SVG lines from chip to 3D node position.

**Phase 4 — polish.** The "How this works" pipeline panel, cluster halos, mobile, and
performance.

## Verification expectations

Every phase is driven in a real browser before it is reported — launched, interacted with,
screenshotted, and the screenshots actually looked at. A green typecheck is not evidence that
anything renders.

Specific checks that have earned their place:

- The bake asserts its exported basis replays the baked coordinates before writing.
- The browser asserts that projecting a corpus node's own text lands on that node's baked
  coordinate. The bake's internal assertion does not cover this: a transposed matmul in
  TypeScript produces plausible coordinates, not a crash.
- The browser embedding is checked for unit length. The dot product is only cosine if it is.
