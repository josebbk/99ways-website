# Pre-Footer CTA — Design A ("Pointer Field")

Status: **draft, not implemented in production — revision 2.** This
document and its sibling files (`design-a.html`, `design-a.css`,
`arrow.svg`) are a review reference only. Nothing in the live Astro
codebase has been touched.

Source-of-truth files consulted: `PRODUCT.md` §4, `ARCHITECTURE.md` §3–5/§8,
`OPERATIONS.md` §1–4, `AGENTS.md` §2.

## Revision 2 — changes from the first pass

Per review notes, three things changed. §3 and §5 below describe the
**current** state; this list is just the delta for traceability.

1. **Opacity raised substantially.** Pointers were far too faint (0.05–0.27).
   Now 0.6–1.0 depending on breakpoint — clearly visible, not a faint
   texture. This departs from the Decorative Logo Field's "faint, 4–18%"
   convention on purpose: that component is atmospheric background noise,
   this one is meant to read as an intentional, visible graphic device
   pointing at the CTA. Documented here so the difference isn't mistaken
   for an inconsistency.
2. **Color changed from muted gray/white to `--color-accent` (bluish,
   `#A6BAFF`, "Inverse Inquiry Blue").** `ARCHITECTURE.md` §3 defines this
   token as covering "everything else interactive" (links, nav, focus
   rings) — using it here extends it into a decorative context, which is
   a real, worth-flagging departure from its documented scope, but it's
   an existing token, not a new color, and matches what was explicitly
   requested after reviewing the source-of-truth files. No `--color-action`
   green is used anywhere in the field (that stays CTA-only, per §3's
   binding rule). A small variant (`--color-accent` mixed 80/20 with
   white) is mixed in for depth — still unambiguously "bluish," no new
   hue introduced.
3. **Pointing math was actually broken, now fixed.** The first pass placed
   pointers in *percentage* coordinates and rotated them using the polar
   angle from a percentage-space center. Because the section's rendered
   width and height are never equal, a "correct" angle in percentage-space
   is NOT the same angle once percentages resolve to pixels — pointers
   were systematically off-target, worse at wider/shorter aspect ratios
   (mobile vs. desktop, exactly where the bug was noticed). Fixed by
   computing every pointer's rotation from **real pixel coordinates**:
   the button's actual `getBoundingClientRect()` center vs. each pointer's
   actual pixel position, recalculated on load, on resize, and once more
   after webfonts finish loading (font swap can shift the button's box by
   a few pixels). This is now correct at any width/aspect ratio, not just
   the three tested breakpoints. Density was also raised (16–34 → 30–72
   across tiers) and placement changed from an outward-biased ring to
   uniform-random-with-rejection across the whole section, which is what
   makes the field feel dense/close rather than sparse.

---

## 1. Concept

A single reusable "pointer" glyph (a short line with an open chevron head)
scattered around the existing Pre-Footer "Book Intro Call" button, each
instance rotated so it aims back toward the button. Density is higher
toward the outer edges of the section and thins out approaching the CTA,
so the button itself sits in a visually clean zone.

This recreates the composition/intent of the reference image the user
supplied (radial pointers converging on a central CTA) without reproducing
it literally — see §4 for the deliberate deviations.

## 2. What did NOT change

- Section background: `--color-bg-alt` (`#313330`) — unchanged, no new
  background color introduced.
- Section padding: `--space-8` mobile → `--space-16` desktop — unchanged.
- Position: immediately after Academy grid, immediately before Footer —
  unchanged.
- CTA content: "Book Intro Call" only. No headline, label, paragraph,
  secondary CTA, or new copy added.
- CTA element: a real `<a role="button">` (would be a real interactive
  element in Astro, not an image) — same visual spec as the Hero CTA
  (`ARCHITECTURE.md` §4, Button — primary): `--color-action` fill,
  `--color-cta-text` / `--color-cta-text-hover` text, `--text-label`
  weight 600, `10px 24px` padding, 2–4px radius, no underline ever.
- "Book Intro Call" destination: still `[TODO]` — no URL invented, per
  `PRODUCT.md` §4 and `AGENTS.md` §2.

## 3. What this design adds

**A decorative pointer-field layer**, absolutely positioned behind the CTA,
`pointer-events: none`, inside a section with `overflow: hidden` (no
page-level horizontal scroll at any breakpoint — verified at 375/414/768/1440px
in the preview).

- **Shape:** one glyph, defined once (`arrow.svg` — a straight line +
  open 3-point chevron, `stroke` only, no fill), reused via rotation/scale/
  opacity per instance. No new icon system introduced.
- **Color:** `--color-accent` (`#A6BAFF`, "Inverse Inquiry Blue," ~80% of
  instances) plus a brighter mix (`color-mix(in srgb, var(--color-accent)
  80%, white)`, ~20%) for a little depth. **No green, no gray, no white,
  no gradients, no glow/box-shadow.** `--color-action` stays reserved for
  the CTA only, per `ARCHITECTURE.md` §3's binding rule.
- **Opacity range:** 0.6–1.0 — clearly visible at every size, not a faint
  texture. See Revision 2 note above for why this departs from the
  Decorative Logo Field's much fainter convention.
- **Size range:** ~14–42px wide (the glyph's bounding box), tier-dependent
  (see Density below).
- **Orientation:** each instance's rotation is computed from its **real
  pixel position** to the button's **real measured center**
  (`getBoundingClientRect()` on both), so every pointer aims exactly at
  the CTA regardless of the section's aspect ratio — see Revision 2 note
  above; this was the bug in the first pass. A small ±4° random jitter is
  layered on top so the field reads as organic rather than a laser-precise
  ring, without ever looking visibly "off."
- **Distribution:** uniform-random across the whole section box, rejecting
  any point that falls inside the protected zone (§5) — this, not an
  outward-biased ring, is what keeps the field dense and close together
  rather than sparse.
- **Density:** 72 instances desktop (≥1024px), 52 tablet (768–1023px),
  30 mobile (<768px) — three explicit tiers matching the project's own
  breakpoint tokens (`ARCHITECTURE.md` §2), each recalculated against the
  actual measured section/button geometry rather than assumed.
- **Motion: none.** Static placement only, no animation/parallax/hover
  effect on the pointers themselves, at any breakpoint or viewport size.
  (The CTA button's own hover state is unaffected and unchanged.)

## 4. Deliberate deviations from the reference image

The reference image is a **composition/mood reference only**, per the
task brief — it is not reproduced literally:

1. **No green arrows, ever.** The reference uses some green-toned arrows;
   `--color-action` is reserved for CTA/action elements only
   (`ARCHITECTURE.md` §3), so the field is entirely blue/blue-white
   instead — matching the reference's *other* dominant arrow color and
   keeping green as the page's single accent, unchallenged.
2. **No glow/bloom effects.** The reference has soft glow halos around
   several arrows; Design A uses flat opacity only — no `filter: blur()`,
   no glow, no box-shadow — matching the site's flat, no-drop-shadow
   component language (`ARCHITECTURE.md` §4, blog-grid card note).
3. **No literal "Book Intro Call" pill shape reused from the reference** —
   the CTA is the site's real, existing primary button component, not a
   redrawn rounded-rect shape.
4. **Pointer accuracy is exact, not approximate.** The reference image's
   arrows converge roughly, not precisely, on its central pill. Design A's
   pointers aim at the button's measured pixel center exactly (§3), which
   reads as more deliberate/engineered than the reference's looser
   hand-drawn feel — a reasonable trade for a real, responsive component.

## 5. Protected zone

An elliptical exclusion zone is centered on the button's **actual
measured** center (`getBoundingClientRect()`), with radii equal to
half the button's real rendered width/height plus a clearance buffer
(22px mobile, 32px tablet, 40px desktop). No pointer's rejection-sampled
position may fall inside this ellipse. This already follows the
Decorative Logo Field's pattern of recalculating against real rendered
content rather than hardcoded coordinates (`ARCHITECTURE.md` §4) — fixed
in Revision 2, see the note above; the first pass used hardcoded
percentages, which is what should NOT carry over, and now doesn't.

## 6. Static vs. generated

This preview generates pointer positions at load time via a **seeded**
pseudo-random function (`mulberry32`, fixed seed `99177`), so the layout
is stable across reloads — this is a review artifact, not a proposal to
ship a runtime-randomized effect.

**Open question for implementation:** should the production component…
- (a) hardcode a fixed array of pointer definitions (position/rotation/
  size/opacity/color) directly in the component, generated once and
  frozen — closer to how the Decorative Logo Field is described
  ("hand-tuned or seeded-random per breakpoint tier"), or
- (b) keep the seeded-generator approach so density/protected-zone
  changes don't require hand-editing every instance?

Either is consistent with `ARCHITECTURE.md` §4's own wording for the
Decorative Logo Field ("hand-tuned **or** seeded-random per breakpoint
tier"). No decision made yet — flagging per `AGENTS.md` §5 rather than
guessing.

**Updated recommendation after Revision 2:** because pointer accuracy now
depends on the button's *actual rendered* pixel geometry (which shifts
slightly with font-loading, zoom, and exact viewport width — not just
three discrete tiers), a fully hardcoded array of fixed positions/angles
would only be exactly correct at the specific widths it was generated
for, and drift at anything in between. Recommend keeping the
seeded-generator approach at runtime (small, deterministic, no external
dependency), with the seed and per-tier options (count/buffer/size/opacity
ranges) hardcoded as constants in the component — i.e., the *randomness
source* is fixed and reviewable, but positions are still computed against
real geometry at render time so pointing stays exact at any width. Still
not a final decision — flagging for discussion before implementation.

## 7. Responsive behavior

| Breakpoint | Pointer count | Buffer | Notes |
|---|---|---|---|
| <768px (mobile) | 30 | 22px | |
| 768–1023px (tablet) | 52 | 32px | |
| ≥1024px (desktop) | 72 | 40px | |

Tiers match the project's own breakpoint tokens (`--bp-md`/`--bp-lg`,
`ARCHITECTURE.md` §2). Within a tier, and across any width the tier
spans, pointer direction is exact — it's computed from live pixel
geometry, not a value baked in per tier (only count/buffer/size are
tier-based; angle math is universal).

No horizontal page scroll introduced at any tested width (375, 414, 768,
1024, 1440px) — verified via the preview's own `overflow: hidden` on the
section and pixel positions clamped to the section's own measured bounds.

## 8. Files in this deliverable

- `design-a.html` — standalone browser preview (no external JS deps;
  loads Google Fonts + its own CSS file only).
- `design-a.css` — all styling, using only tokens already defined in
  `ARCHITECTURE.md` §3. No new custom properties introduced beyond the
  ones this component itself needs internally (`--pointer-rot`,
  `--pointer-opacity`, `--pointer-color`, which are per-instance
  positioning hooks, not design tokens).
- `arrow.svg` — the single reusable pointer glyph as a standalone source
  asset (the HTML preview also inlines the equivalent path so it renders
  standalone from `file://`).
- `design-a-spec.md` — this document.

## 9. Explicitly not touched by this design

Per the task's critical constraints and `AGENTS.md` §2: no changes to
copy, no new booking URL, no image-based CTA, no other homepage section,
no footer, no CMS/backend, no light theme, no frog mascot, no horizontal
scroll, no green used decoratively, no alteration to the CTA's existing
styling/behavior.

## 10. Next step

Awaiting review. Per the agreed workflow:
- **"notes for improvements:"** → this design's files are revised in place.
- **"create me a brand new design"** → a new, separate design iteration
  (Design B) is created instead of modifying this one.

Once a design is approved, its final files should be copied into
`docs/reference-for-implement/pre-footer-artwork/` in the actual repo, and
a self-contained CLI implementation task prompt (following the
`OPERATIONS.md` §1 structure) will be written separately to wire the
approved design into the real Astro `PreFooterCTA` section — including
the required `ARCHITECTURE.md` §4/§8 documentation updates per
`AGENTS.md` §4 (new component spec, since this introduces a new
decorative pattern not currently documented anywhere in the design
system).
