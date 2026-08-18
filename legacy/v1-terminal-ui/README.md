# v1 — Terminal UI (archived)

The complete frontend as it stood before the "Ask My Portfolio" rebuild:
the dark terminal/JetBrains-Mono design (Hero, About, Skills, Education,
Experience, Projects, Certificates, Contact, Navigation) plus the 3D flight-log
globe at `/flight`.

Archived 2026-08-18. Nothing here is imported by the live app — it is a
reference copy only, kept because the rebuild replaces every component.

## Also in git, which is the authoritative copy

    git tag v1-terminal-ui        # snapshot of this exact state
    git checkout v1-terminal-ui   # inspect it in place

To run the old site side by side with the new one without touching this branch:

    git worktree add ../Portfolio-v1 v1-terminal-ui
    cd ../Portfolio-v1 && npm install && npm run dev

## What is NOT archived here

`src/data/*.ts` is carried forward into the rebuild rather than retired — it is
content, not UI. `public/` (certificates, images, resume PDF) is untouched.
