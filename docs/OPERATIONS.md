# OPERATIONS.md — Workflow, Verification & Execution Guidelines

## 1. Task prompt conventions

Every task prompt for this project follows the same structure — use it when writing new tasks, and expect it when reading them:

1. **Scope** — what this task covers and, explicitly, what it doesn't.
2. **Reference files/sections** — the specific parts of `PRODUCT.md` / `ARCHITECTURE.md` needed for this task. Read only what's cited; don't pull in unrelated sections.
3. **Context** — what already exists in the codebase, so the agent doesn't rebuild working components from scratch.
4. **Implementation steps.**
5. **Constraints** — explicit things not to touch.
6. **Expected result.**
7. **Verification** — a checklist to run before reporting the task done, phrased so results are objectively checkable (not "looks right" but "confirm X happens when Y").

## 2. Task granularity

Tasks are kept atomic and modular — one focused area per task (e.g. "header nav behavior," "testimonial carousel," "footer social icons") rather than one task covering the whole homepage. Reasons this matters here specifically:
- Reduces how much an agent has to hold in context per session, which measurably improved implementation accuracy on this project after the first attempt at a single giant task.
- Makes defects traceable to a specific task/commit rather than "somewhere in the build."
- Each task is independently verifiable before the next one starts.

**Every CLI session is independent with zero memory of prior sessions.** A task prompt must be fully self-contained — restate the context it needs rather than assuming continuity from a conversation that produced an earlier task. Don't reference "the task we discussed" or similar; reference the actual doc sections.

## 3. Verification patterns that matter on this project

These aren't generic advice — they're checks that have caught real regressions on this specific build:

- **Content accuracy diff.** After any section touching copy, diff the rendered output against `ARCHITECTURE.md` §8 verbatim — headline, subhead, nav labels, footer links, bios, excerpts, legal text, alt text. Copy drift (rewording, truncation, reordering) has happened silently before.
- **Placeholder/scaffold check.** Before marking any content-collection-backed section done, confirm the framework's own default placeholder content isn't what's actually rendering. This has broken before (a CMS's default "Welcome — your first post" content shipped to production undetected).
- **Mobile-first responsive check, not desktop-first.** Test at real mobile widths (not just a narrowed desktop browser) — 375px and 414px are good baselines — before checking desktop. Confirm zero horizontal page scroll anywhere; the testimonial carousel previously caused this exact bug (replaced with static masonry in `TestimonialsMasonry.astro` — the verification pattern remains relevant for any future component that could introduce horizontal scroll).
- **Independent-state verification for split-behavior controls.** The mobile "Optimization Experiences" arrow-vs-text pattern (see `ARCHITECTURE.md` §4, Nav dropdown) has been implemented as one coupled handler instead of two independent ones more than once. When a spec calls for two DOM elements with independent handlers, verify each one's effect *in isolation* — tap the arrow and confirm nothing navigates, tap the text and confirm the submenu state doesn't change as a side effect.
- **Cropping/aspect-ratio checks against real images, not assumptions.** The testimonials masonry uses `object-fit: cover` as a safety net — each image has a declared `aspect-ratio` class matching its native dimensions (see `ARCHITECTURE.md` §4). Verify rendered images aren't horizontally cropped beyond the declared ratio, especially for wider images where the column width at mobile breakpoints could differ from the source aspect ratio.
- **Color/token checks against hex values, not visual approximation.** Where a spec gives exact values (e.g. the CTA text color override `#0F172A`/`#000000`), verify the rendered value matches, not just "looks dark enough."

## 4. Pattern to avoid: the "approximate fix" loop

Several defects on this project were "fixed" more than once because an agent implemented a plausible-but-imprecise version of a precise requirement, which passed a shallow check but failed the real one. Concretely:
- The desktop dropdown close-timing rule went through a delay-based version, an unreliable revision of that delay logic, and was finally simplified to a delay-free combined-hover-region model — three passes on what should have been one.
- The mobile "Optimization Experiences" split-tap-target behavior failed twice from being implemented as a single handler with conditional logic instead of two genuinely independent DOM elements/handlers.

**To avoid repeating this pattern:** when a spec includes precise implementation guidance (a specific DOM structure, a specific state-management approach, an explicit "don't do X, do Y instead"), follow it exactly rather than substituting an approach that seems functionally equivalent. If the precise approach genuinely can't be followed for a technical reason, say so explicitly in the task report rather than silently substituting something else.

## 5. Project history relevant to how this codebase got here

Kept here rather than deleted, because it explains constraints that might otherwise look arbitrary:

- The project briefly evaluated **EmDash CMS** before settling on Astro-only. That evaluation ended specifically because of persistent admin-dashboard/authentication setup problems that blocked content management. The current Astro-only, no-CMS, content-in-repo architecture is a direct response to that — don't reintroduce a CMS dependency without understanding this history first.
- The homepage went through two prior consolidated-doc structures before this one (an original `DESIGN_SYSTEM.md`/`HOMEPAGE_SPEC.md`/`ASSET_MANIFEST.md` split, superseded by a `design.md`/`HOMEPAGE_SPEC.md`/`ASSET_MANIFEST.md` split, now superseded by this `AGENTS.md`/`PRODUCT.md`/`ARCHITECTURE.md`/`OPERATIONS.md` split). Each consolidation happened because the previous structure was getting harder to keep current across many small fix tasks — that's the same failure mode this structure should watch for as it grows. If these four files start accumulating enough one-off task history that they get hard to navigate, that's the signal for another consolidation pass, not a reason to keep bolting on sections indefinitely.

## 6. Build & deploy

- Static build, no server runtime required for the homepage itself.
- No environment secrets currently required by the homepage (no CMS API keys, no Maps API key — both were removed from scope).
- Two links ship intentionally non-functional (`[TODO]` in `ARCHITECTURE.md` §8) — this is expected, not a build error, until a booking tool is wired up.
