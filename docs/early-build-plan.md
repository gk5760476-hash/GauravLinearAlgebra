# Early Build Plan

**Linear Algebra, Made Visible** · based on [product spec v1.0](product-spec-v1.0.pdf) (2 November 2026)

This plan covers the work from an empty folder up to a tested prototype of the three labs that the spec's final recommendation (§23) says to build first:

1. **Vector playground**: drag two vectors, add and scale them.
2. **Matrix transformation lab**: edit a 2×2 matrix and watch the grid move.
3. **Row-reduction theatre**: apply one row operation at a time and watch the equations change.

It turns spec §18 Phase 0 (Validate) and Phase 1 (Prototype) into concrete tasks, ending with a go/no-go decision on Phase 2 (MVP).

**End goal:** a beginner can open the app without signing in and use all three labs by mouse, touch or keyboard. At least five beginner testers have used the labs, and what they showed us is written down.

---

## 1. Scope

| In this plan | Not in this plan (later phases) |
|---|---|
| Project setup, CI, hosting for test sessions | Accounts, backend, database, cloud sync |
| Learner and instructor interviews (Phase 0) | Full lessons, beginner diagnostic, learning paths |
| Math engine for vectors, 2×2/3×3 matrices, row operations | Determinant, basis, projection, eigenvector labs |
| Three interactive labs | Practice engine with question bank and hint ladder |
| One prediction checkpoint per lab | Proof studio, exam practice, PYQ (past-year question) uploads |
| Accessibility built in from day one | Teacher mode, AI explanations, Hindi translation |
| A prototype test round with beginners | Analytics, spaced review, progress dashboard |

Anything in the right-hand column waits until after the go/no-go decision in §7.

---

## 2. Decisions to make now

These come from the spec's open decisions (§22) and stack suggestions (§14). Each one has a recommended default so work isn't blocked.

| Decision | Recommendation for the early build | Must be final by |
|---|---|---|
| Which syllabus track (general first-year, DU MA Economics Sem 1, or both) | **Defer.** All three labs are needed for both tracks. Decide at the end of Phase 0, using what interviews show. | Start of Phase 2 |
| Anonymous/local-first or accounts | **Local-first, no accounts, no backend.** Lab state stays in memory; Phase 2 adds saved progress in the browser. The spec already makes auth optional for the MVP. | Start of Phase 2 |
| Launch languages | **English only**, but keep every user-facing string in `src/content/en/` and none inside components, so Hindi can be added later (§13). | Now (affects code layout) |
| Who reviews the maths | **Name one person** (for example an instructor from the Phase 0 interviews) to check engine test cases and the explanation text in each lab. | End of Phase 1 |
| Free / open-source / monetised | Decide before the repository is made public, because it sets the licence. | First public push |

Record each final decision, with its date, in `docs/decisions.md`. This supports the spec's auditability requirement (§13).

### Stack

| Layer | Choice | Why |
|---|---|---|
| Build and dev server | Vite | Minimal setup; produces a static site |
| UI | React + TypeScript (strict mode) | As recommended in spec §14 |
| 2D visuals | Hand-written SVG components | Full control over correctness; each SVG element can carry an accessible label; 2D at this scale doesn't need Canvas or WebGL |
| Notation | KaTeX | Fast, and also outputs MathML that screen readers can use |
| Exact arithmetic | Small in-house `Rational` type built on `bigint` | §15 prefers exact fractions; avoids display bugs like `0.30000000000000004` |
| Unit tests | Vitest + fast-check (property-based tests) | §15 asks for identities checked over many generated matrices, not just a few examples |
| End-to-end and accessibility tests | Playwright + `@axe-core/playwright` | Keyboard-only flows and automated WCAG checks |
| Lint and format | ESLint + Prettier | — |
| Hosting for test sessions | Any static host (GitHub Pages, Netlify, Vercel) | The prototype has no server |

---

## 3. Architecture for the prototype

The spec's architecture flow (§14) is:

> Learner action → UI control → validated mathematical function → state update → visual render + numeric result → explanation/feedback

**The one rule:** components never do maths. Every number on screen and every mathematical result comes from `src/math`. Components only turn engine results into screen positions and text. This prevents the risk the spec names as "Incorrect visual or computation" (§20).

### Folder layout

```
src/
  math/                 pure TypeScript: no React, no DOM
    rational.ts         exact fractions (bigint numerator/denominator)
    vector.ts           add, scale, dot, length
    matrix.ts           Matrix type, multiply with dimension checks, columns, det
    rowOps.ts           swap / scale / replace, each with its inverse and det multiplier
    systems.ts          pivots, step-by-step RREF, solution-case classification
    errors.ts           typed error codes (text lives in content/)
  labs/
    vector-playground/
    matrix-transform/
    row-reduction/
  components/           shared: GridPlane, Arrow, MatrixInput, Tex, SourceLabel,
                        DescriptionPanel, PredictionCheck
  state/                useHistory: undo, redo, reset, before/after compare
  content/
    en/                 all user-facing text: lab copy, error messages, glossary
tests/
  math/                 Vitest unit + property tests
  e2e/                  Playwright flows + axe checks
docs/
  product-spec-v1.0.pdf
  early-build-plan.md
  decisions.md
```

### Every lab has the same parts

- **State**: plain data, such as two vectors, a matrix, or a list of row operations.
- **Controls**: pointer and keyboard, both from the start.
- **Text description**: a sentence in an `aria-live` region that updates whenever the state changes. This is the accessible version of the picture (FR-11).
- **Reset, undo, and before/after compare** (FR-12).
- **Prediction checkpoint**: the learner commits to a guess before the result is revealed (§4).
- **Source label**: every preset value is labelled *Illustration* (§9).
- **Reduced motion**: when `prefers-reduced-motion` is set, animations jump straight to the end state.

---

## 4. Week 0: Setup (2–3 days)

- [x] `git init`
- [ ] First commit containing the README, this plan, and the spec (waiting for a git name and email)
- [x] Scaffold a Vite React + TypeScript app with `strict: true`
- [x] Add ESLint, Prettier, Vitest, fast-check, Playwright, and axe
- [x] Set up CI to run, in order: typecheck → lint → unit tests → e2e tests (runs once the repo is on GitHub)
- [x] Create the folder layout above, with the `Tex` and `SourceLabel` components (`labs/` and `state/` arrive with the first lab)
- [ ] Deploy the empty app to a static host so test sessions have a URL
- [x] Create `docs/decisions.md` and record the stack decision

**Done when:** CI passes on a blank app that is reachable at a public URL.

---

## 5. Phase 0: Validate (weeks 1–2), two tracks in parallel

The maths doesn't depend on what interviews reveal, so the engine can be built while research happens.

### Track A: Learner and instructor research

**Who:** 5–8 beginners and 2–3 instructors (§18). Recruit by persona (§3). At least half should be first-time learners, not friends who already know linear algebra.

**What to show:** low-fidelity sketches (paper or Figma) of vector addition, a row operation, and the unit square under a matrix, including its signed area. Phase 0 in the spec asks for determinant sketches, and Lab 2 can show signed area as a preview.

**Beginner session (about 30 minutes):**

1. Warm-up: "What do you think a matrix *does*?" There's no right answer; listen for the words they use.
2. Predict: for each sketch, ask where they think the result will land.
3. Reveal and explain: show the result and ask what changed and why.
4. Take notes on hesitations, vocabulary, and any misconception from §9 that comes up (for example transpose vs inverse, or "all row operations keep the determinant").

**Instructor session:** Which misconceptions do they see most? Which syllabus do they teach? Would they use a lab live in class?

**Outputs**

- Syllabus track decision, recorded in `docs/decisions.md`
- A ranked list of misconceptions, each matched to the lab that should address it (this later feeds hint text)
- Revised lab sketches
- A named maths reviewer

### Track B: Math engine

| Module | Must provide |
|---|---|
| `rational` | Keep fractions reduced, with the sign on the numerator; reject zero denominators; `+ − × ÷`; compare; format as `−3/4`; parse `2`, `-1.5`, `3/4` exactly |
| `vector` | Add, scale, dot, squared length. Show length exactly when possible (`\|(3, 4)\| = 5`), otherwise as a root with an approximation (`\|(1, 2)\| = √5 ≈ 2.236`) |
| `matrix` | Build with dimension validation; multiply with a dimension check; get columns; `Ax` returned as its column combination (`x₁·col₁ + x₂·col₂`) so the UI can show each term; determinant for 2×2 and 3×3 |
| `rowOps` | `swap(i, j)`, `scale(i, α)` with α ≠ 0, `replace(i, j, c)` with i ≠ j. Each returns the new matrix, its inverse operation, its determinant multiplier, and a description key |
| `systems` | Pivot positions; RREF built from recorded row operations so every step can be replayed; classify the solution as unique, none, or infinitely many |
| `errors` | Typed codes such as `DIMENSION_MISMATCH` and `SCALE_BY_ZERO`; the plain-language text lives in `content/en/` (FR-04) |

**Engine tests** (the prototype subset of §15):

| Test | Type |
|---|---|
| Rational identities: `(a + b) − b = a`; `(a × b) ÷ b = a` for b ≠ 0 | property |
| Multiplying incompatible matrices raises `DIMENSION_MISMATCH` | unit |
| `Ax` equals `x₁·col₁ + x₂·col₂` | property |
| Determinant of known exact cases: identity, 90° rotation, shear, singular | unit |
| Swap multiplies det by −1; scaling by α multiplies det by α; replacement leaves det unchanged | property |
| Applying any row operation and then its inverse returns the original matrix | property |
| Row operations preserve the solution set: a system with a unique solution has the same solution after any operation | property |
| Scaling a row by 0 is rejected with `SCALE_BY_ZERO` | unit |
| Replaying the recorded RREF steps reproduces the final matrix | property |

**Phase 0 is done when:** the syllabus track is decided, the misconception list exists, and every engine function the three labs use has passing tests.

---

## 6. Phase 1: Prototype the three labs (weeks 3–5)

Build one lab per week, in this order. Each lab reuses the previous one's parts: the vector playground creates the grid, arrows, and keyboard handles; the matrix lab adds the matrix input; the row-reduction theatre adds the operation history.

### Lab 1: Vector playground (week 3)

- Move the tips of **u** and **v** by dragging, by arrow keys (1 unit; Shift + arrow for ½ unit), or by typing coordinates. Positions snap to half-units, so every value stays an exact fraction.
- Toggle **u + v** with the parallelogram drawn; use a slider for **c·u** (c from −3 to 3 in steps of ½).
- Readouts show coordinates and length.
- **Prediction:** before revealing u + v, the learner places a guess point. The reveal shows the true sum next to the guess.
- **Example description:** "u = (2, 1). v = (−1, 3). u + v = (1, 4), the far corner of the parallelogram formed by u and v."
- **Spec check (§21):** the learner can add two vectors and see the resulting vector and its coordinates.

### Lab 2: Matrix transformation lab (week 4)

- Edit a 2×2 matrix. Inputs accept integers, decimals, and fractions such as `1/2`.
- Show the grid, the unit square, the arrows **e₁** and **e₂**, and one chosen vector **x**, before and after the transformation.
- Show `Ax = x₁(column 1) + x₂(column 2)` with the actual numbers filled in.
- Presets, labelled *Illustration*: scale, 90° rotation, reflection in y = x, shear, and a singular matrix that collapses the plane onto a line.
- Animate from the identity to A. Frames in between use (1 − t)·I + t·A, which is a visual transition and not a "partial rotation". Show numbers only at the start and end. With reduced motion, jump straight to the end.
- **Stretch goal:** show the signed area of the transformed unit square and whether orientation flipped. This previews the determinant lab in Phase 3.
- **Example description:** "e₁ moves to (2, 0) and e₂ moves to (1, 1). The unit square becomes a parallelogram with area 2. The vector x = (1, 2) moves to (4, 2)."
- **Spec check (§21):** the learner can edit a 2×2 matrix and see its effect on the grid and basis vectors.

### Lab 3: Row-reduction theatre (week 5)

- Start from a preset system with 2 or 3 unknowns (labelled *Illustration*) or one the learner types in.
- Apply one operation at a time: swap Rᵢ ↔ Rⱼ, scale Rᵢ ← αRᵢ (α ≠ 0), or replace Rᵢ ← Rᵢ + cRⱼ.
- Show three views side by side: the augmented matrix, the equation system, and, for 2 unknowns, the two lines on the plane. The lines move but their intersection stays fixed, which shows that the solution set is preserved. Parallel or identical lines show the "no solution" and "infinitely many" cases.
- After each operation, highlight the changed row, mark the pivots, and explain in one sentence why the solutions didn't change (every operation can be undone).
- Keep an operation history with undo and redo.
- The engine tracks the determinant multiplier, but the lab hides it. It belongs in the Phase 3 determinant lesson, and showing it here would add to the overload risk (§20).
- **Example invalid-operation message:** "You can't multiply a row by 0. It would erase that equation, and the step couldn't be undone."
- **Example description:** "Row 2 was replaced by Row 2 − 3 × Row 1. The equations are now x + 2y = 5 and −7y = −14. Both lines still pass through (1, 2)."
- **Spec check (§21):** the learner can perform a row operation and see the matrix and the equation system update together.

### Definition of done (applies to every lab)

- [ ] Every number on screen comes from `src/math`; components contain no maths
- [ ] Every interaction works by keyboard alone, with visible focus
- [ ] The text description updates on every state change
- [ ] Colour is never the only way to tell things apart: u, v, e₁, e₂ and pivots also have text labels or patterns
- [ ] `prefers-reduced-motion` is respected
- [ ] Reset, undo, and before/after compare work
- [ ] Invalid input gets a plain-language message and never fails silently
- [ ] Preset values carry the *Illustration* label
- [ ] Usable at phone width (360 px) without horizontal scrolling
- [ ] axe reports no violations, and a Playwright test covers the main keyboard flow
- [ ] The maths reviewer has checked the explanation sentences

---

## 7. Week 6: Prototype test round and go/no-go

**Testers:** at least five beginners. Where possible, use new people rather than Phase 0 participants, since those participants have already seen the sketches.

**Protocol for each lab:**

1. Two short pre-questions, such as "Where does (2, 1) + (−1, 3) land?"
2. Use the lab while thinking aloud.
3. A post-question of the same difficulty, plus "Explain what happened in your own words."

**What to record** (based on §19):

- Whether they completed the task, and the time to their first successful interaction
- Explanation quality before and after, scored on a simple 0–2 rubric
- Misconceptions that came up
- At least one complete keyboard-only run and one complete screen-reader run, done by a tester or a team member

Clicks, streaks, and time on page are not evidence of learning (§19), so don't report them as results.

**Go to Phase 2 if:** most testers complete each lab's main task without help, their explanations after using a lab are clearer than before, and no correctness bug is open. Otherwise, improve the labs before adding lessons, as §23 recommends.

---

## 8. Timeline at a glance

| Week | Research track | Build track | Output |
|---|---|---|---|
| 0 | — | Setup | Blank app online, CI passing |
| 1–2 | Phase 0 interviews | Math engine + tests | Syllabus decision, misconception list, tested engine |
| 3 | — | Lab 1: Vector playground | Lab meets its definition of done |
| 4 | Recruit testers | Lab 2: Matrix transformation | Lab meets its definition of done |
| 5 | Prepare test protocol | Lab 3: Row-reduction theatre | Lab meets its definition of done |
| 6 | Prototype test round | Fixes | Go/no-go decision for Phase 2 |

This sits at the upper end of the spec's estimates (Phase 0: 1–2 weeks, Phase 1: 2–3 weeks). The spec's figures assume a small team, so a single part-time builder should expect it to take longer.

---

## 9. What to leave ready for Phase 2

During Phase 1, build these foundations but don't fill them with content:

- **Lesson schema:** turn Appendix A into a TypeScript type with runtime validation, plus one sample lesson that passes it. Use the concept IDs and record fields from [curriculum.md §11](curriculum.md#11-what-this-means-for-the-build).
- **Provenance labels:** a single enum with values `textbook-original`, `uploaded-past-paper`, `instructor-provided`, `app-generated`, `illustration`. Note that the spec uses both "app-authored" (§4, Appendix A) and "app-generated" (§8E, §9, §16). Choose one identifier and record the choice in `docs/decisions.md`.
- **Hint ladder:** a 3-level hint design (small hint → stronger hint → worked solution), written from the Phase 0 misconception list.
- **Saved progress:** a storage interface that the browser-storage version can implement in Phase 2 and a cloud version can implement later.

---

## 10. Risks in the early build

| Risk | Mitigation |
|---|---|
| Polishing visuals before the maths is reliable | Build the engine and its tests first (Track B); components contain no maths |
| Floating-point display bugs | Use rationals throughout; use decimals only for root approximations, always marked with ≈ |
| Animation suggests the wrong maths | Show numbers only at the start and end; present tweens as transitions |
| Accessibility added too late | It's part of each lab's definition of done, with axe running in CI from Week 0 |
| Scope creep into lessons, accounts, or AI hints | Use the scope table in §1 and the go/no-go decision in §7 |
| Testing only with people who already know linear algebra | Recruit by persona; at least half the testers are first-time learners |

---

## Next actions

1. Decide (or provisionally accept) the stack in §2.
2. Do the Week 0 setup checklist.
3. Start recruiting Phase 0 interviewees now, because scheduling takes the longest.
4. Begin `src/math/rational.ts` and its tests. Everything else depends on it.
