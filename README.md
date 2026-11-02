# Linear Algebra, Made Visible

An interactive web app that teaches linear algebra to beginners. Its core promise: **see it move, understand what changed, then prove or calculate it.**

> **Status: early build.** The app shell, the tooling and the first piece of the maths engine (exact fractions) are in place; the three labs are next. The full product spec is in [docs/product-spec-v1.0.pdf](docs/product-spec-v1.0.pdf), the course map is in [docs/curriculum.md](docs/curriculum.md), and the build steps are in [docs/early-build-plan.md](docs/early-build-plan.md). "Linear Algebra, Made Visible" is a working name.

## What it is

Each lesson links four views of the same idea, and learners can switch between them at any time:

1. **Visual**: something to drag, edit, or watch change
2. **Plain language**: what problem the concept solves
3. **Formal notation**: definitions and derivations, introduced one step at a time
4. **Practice**: a short check that the idea has stuck

The app is for students new to linear algebra, including those preparing for undergraduate or postgraduate exams. It also aims to help returning learners and tutors who want to demonstrate a concept live.

## First milestone

Three interactive labs, tested with real beginners before any full course is built:

| Lab | What the learner does |
|---|---|
| **Vector playground** | Drag or type two vectors, add and scale them, and see coordinates and the parallelogram |
| **Matrix transformation lab** | Edit a 2×2 matrix and watch the grid, the unit square, and the basis vectors move |
| **Row-reduction theatre** | Apply one row operation at a time and see the matrix, the equations, and the lines update together |

The full course, from vectors up to the singular value decomposition and Jordan form, is mapped in [docs/curriculum.md](docs/curriculum.md). It comes after these labs work for learners.

## Ground rules

These are condensed from spec §4, §15, and §16 and apply to all code and content:

- **One maths engine.** All calculations live in `src/math` and are covered by tests. Visuals display its results and never compute their own.
- **Exact where possible.** Use fractions instead of floating-point values. Approximations are always marked with ≈.
- **Honest sources.** Every example or question is labelled as one of: textbook original, uploaded past paper, instructor-provided, app-generated practice, or illustration. Never invent a citation.
- **Accessible from the start.** Everything works by keyboard alone, every visual state has a text description, colour is never the only signal, and reduced-motion settings are respected.
- **An example is not a proof.** A numerical example illustrates a theorem; it doesn't prove it.

## Tech stack

React + TypeScript (Vite) · hand-written SVG for visuals · KaTeX for notation · an in-house exact-fraction type · Vitest + fast-check for maths tests · Playwright + axe for accessibility and layout tests

The stack is provisional until after Phase 1; see [docs/decisions.md](docs/decisions.md).

## Project layout

```
src/
  math/         tested maths engine (no UI code; lint enforces this)
  components/   shared UI: notation (Tex), source labels
  content/en/   all user-facing text, kept separate for later translation
  labs/         one folder per interactive lab (arrives with the first lab)
  state/        undo, redo, reset, before/after compare (arrives with the first lab)
tests/
  math/         unit and property-based tests for the engine
  e2e/          browser tests: page load, accessibility, phone width
docs/           product spec, curriculum, build plan, decision log
```

## Running the app

You need Node.js 22.12 or newer (the project is developed on 26.13).

```
npm install
npm run dev
```

Then open http://localhost:5173.

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server with live reload |
| `npm test` | Runs the maths engine's unit and property tests |
| `npm run test:e2e` | Runs the browser tests, including an automated accessibility scan, at desktop and phone width. Before the first run, install the browser with `npx playwright install chromium` |
| `npm run check` | Typecheck, lint, format check and unit tests in one go; run this before committing |
| `npm run build` | Builds the production site into `dist/` |
| `npm run format` | Formats the code with Prettier (Markdown docs are excluded) |

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs all of these once the repository is on GitHub.

## Documents

| Document | Contents |
|---|---|
| [docs/product-spec-v1.0.pdf](docs/product-spec-v1.0.pdf) | Product requirements, learning design, curriculum, architecture, testing policy, and research references |
| [docs/curriculum.md](docs/curriculum.md) | The full course: 14 modules, 153 concepts with prerequisites, connecting threads, notation standard, and research basis |
| [docs/early-build-plan.md](docs/early-build-plan.md) | Setup, learner research, the maths engine, the three-lab prototype, and the go/no-go test round |

## Open decisions

These come from spec §22 and are tracked in the build plan:

- Which syllabus the first course targets: general first-year linear algebra, DU MA Economics Semester 1, or both
- Whether the first version is local-first or has accounts and cloud sync
- Whether launch is English only or English plus Hindi
- Who reviews the maths content before release
- Whether the app is free, open source, institution-funded, or monetised

## Licence

Not chosen yet. The licence depends on the last open decision above.
