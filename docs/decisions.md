# Decision Log

Each entry records what was decided, when, and why. Add new entries at the bottom; when a decision changes, add a new entry that supersedes the old one instead of editing it (spec §13, auditability).

| # | Date | Decision | Status | Why / source |
|---|---|---|---|---|
| 1 | 2026-11-02 | Stack: Vite, React + TypeScript (strict), hand-written SVG, KaTeX, in-house `Rational` type on `bigint`, Vitest + fast-check, Playwright + axe, ESLint + Prettier | Accepted (provisional, revisit after Phase 1) | [Build plan §2](early-build-plan.md#2-decisions-to-make-now); spec §14 |
| 2 | 2026-11-02 | No accounts, no backend, no database for the prototype | Accepted for Phase 0–1 | Spec §14: auth optional for the MVP; build plan §2 |
| 3 | 2026-11-02 | English only at launch; every user-facing string lives in `src/content/en/`, never inside components | Accepted | Spec §13, internationalisation |
| 4 | 2026-11-02 | The provenance identifier for questions the app writes is `app-generated` (display text: "App-generated practice"). The spec's "app-authored" is treated as a synonym and not used in code | Accepted | The spec uses both; "app-generated" appears in §8E, §9 and §16. See build plan §9 |
| 5 | 2026-11-02 | Course structure follows [curriculum.md](curriculum.md) (14 modules), including its changes to spec §6: rank and kernel move into M6–M7, proof and exam practice become cross-cutting tracks, and M11–M13 are added | Working assumption | [curriculum.md §4](curriculum.md#4-course-at-a-glance) |

## Still open

| Decision | Needed by | Notes |
|---|---|---|
| Syllabus track (general first-year, DU MA Economics Sem 1, or both) | Start of Phase 2 | Tag the official syllabus against curriculum concept IDs ([curriculum.md §10](curriculum.md#10-tracks)) |
| Who reviews the maths | End of Phase 1 | Ideally an instructor from the Phase 0 interviews |
| Licence: free, open source, institution-funded or monetised | Before the repository is made public | Spec §22 |
| Static host for test sessions | Week 0 | Needs your account; any static host works |
