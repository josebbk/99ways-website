# AGENTS.md — Execution Rules & Self-Documentation Protocol

This file governs how a CLI coding agent works on the 99ways.io codebase. Read this file first, before any task-specific prompt, and before `PRODUCT.md`, `ARCHITECTURE.md`, or `OPERATIONS.md`. This file, together with the other three, **replaces and fully absorbs** `design.md`, `HOMEPAGE_SPEC.md`, and `ASSET_MANIFEST.md` — those three files are no longer maintained and can be deleted once this set is in place.

---

## 1. What this project is

99ways.io is a CRO (conversion rate optimization) agency site, migrated from WordPress to a framework-only Astro build (no CMS, no admin dashboard). Content — copy, blog posts, testimonials — lives in the repo itself (Markdown/MDX content collections and static assets), not in a database or an editor UI. See `PRODUCT.md` for the full picture of what the site is for.

---

## 2. Non-negotiable constraints

These apply to every task, regardless of what an individual task prompt says:

- **Never invent copy.** All homepage copy (headlines, bios, excerpts, legal text, link labels) is sourced verbatim from the live WordPress site and is documented in full in `ARCHITECTURE.md` §5 (Site Structure). If a task requires copy that isn't there, stop and flag it — don't write placeholder or "reasonable-sounding" text and ship it as real content.
- **Never invent a destination for a `[TODO]`-marked link.** Two links are intentionally non-functional right now: the "Book Intro Call" CTA (no booking tool exists yet) has no URL. Leave these as documented placeholders unless a task explicitly provides a real URL.
- **Never reintroduce removed elements** without an explicit instruction to do so: the frog mascot, the Google Maps embed, a CMS/admin dashboard of any kind, a light theme.
- **Mobile-first, always.** Build and validate the mobile layout before adapting up to tablet/desktop. Desktop is never the reference point a mobile fallback gets derived from — it's the other way around. See `ARCHITECTURE.md` §2 for breakpoint tokens.
- **Don't rebuild what already exists.** Most tasks are modifications to an existing, working codebase, not greenfield builds. A task prompt will tell you what already exists and what you're allowed to touch — stay inside that boundary. If a task doesn't say a component already exists, verify against the live codebase before assuming you need to build it from scratch.
- **Respect scoped exceptions as scoped.** Several rules in `ARCHITECTURE.md` have deliberate, narrow exceptions (e.g. the Decorative Logo Field's below-minimum logo sizing, the CTA button's off-palette text color, the testimonial carousel's heavier interaction pattern). These exceptions apply *only* to the specific component they're attached to. Never use one exception as precedent to relax a rule somewhere else.

---

## 3. How to read a task prompt

A task prompt will typically specify:
1. **Scope** — what this task covers, and explicitly what it does not.
2. **Reference files/sections** — read only what's cited unless the task says otherwise; don't re-derive requirements from memory of earlier tasks.
3. **Context** — what already exists in the codebase that this task builds on or modifies.
4. **Implementation steps.**
5. **Constraints** — things not to touch.
6. **Expected result.**
7. **Verification** — explicit checks to run before reporting the task done.

Each CLI session is independent and has no memory of prior sessions. Any context a task needs must be in that task's own prompt or in these four docs — never assume carry-over knowledge from a conversation that produced an earlier task.

---

## 4. Self-documentation protocol

When a task changes something one of these four files describes, **update that file as part of finishing the task** — don't leave the docs stale for a human to reconcile later. Rules for what goes where:

- **A design-token, component-styling, or breakpoint change** (color, type scale, spacing, a component's visual/interaction spec) → update `ARCHITECTURE.md` §3–4 (Design System / Components).
- **A copy, link, or per-section structural change** (new section, reordered content, a link target that changed) → update `ARCHITECTURE.md` §5 (Site Structure).
- **A newly sourced or newly required asset** (an image, icon, font) → update `ARCHITECTURE.md` §6 (Asset Manifest) with its real path/URL. Never leave a placeholder path in the doc that doesn't match what's actually in the repo.
- **A resolved or newly discovered open item/blocker** → update `PRODUCT.md` §4 (Open Items & Roadmap). Mark resolved items resolved (don't delete the history — note what changed and why, the way earlier entries in this doc do). Add newly discovered blockers with enough context that a future session understands them without re-deriving.
- **A change to how tasks should be run, verified, or structured** (a new recurring verification check, a build/test step) → update `OPERATIONS.md`.

When updating a doc: edit in place, keep the surrounding structure and tone consistent with the rest of the file, and don't silently delete history that explains *why* a rule exists — these docs have accumulated real lessons from things that broke (see `OPERATIONS.md` §3 for examples). If you're unsure whether something is "done" or still open, treat it as open and say so explicitly rather than guessing.

---

## 5. When something is ambiguous

If a task references a rule that seems to conflict with another rule, or a spec detail is missing entirely: **stop and flag it in your report rather than guessing and shipping.** This codebase has a documented history of the same bug being "fixed" two or three times because an agent implemented an approximate version of a precise requirement — see `OPERATIONS.md` §4 for what that pattern looks like and how to avoid repeating it.
