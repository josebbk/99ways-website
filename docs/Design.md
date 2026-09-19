# 99Ways — Design System (design.md)

**This file replaces `DESIGN_SYSTEM.md` as the single source of truth for the visual system.** Same purpose, same source docs (`reference/logo-specification.md`, `reference/palette.md`, `README.md` in the brand assets repo) — consolidated into one file per the "future pages/designers reference" requirement instead of keeping two overlapping docs. Anything marked **(derived)** fills a gap the brand docs don't cover and can be adjusted without breaking brand compliance.

Theme: **dark only.** No light-mode toggle is in scope.

**Design approach: mobile-first.** Base styles below are the mobile values. Desktop is a progressive enhancement on top, not the reference point — build and validate mobile first, then adapt up.

```css
:root {
  --bp-sm: 480px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
}
```

---

## 1. Color tokens

```css
:root {
  /* Base */
  --color-bg: #292B2A;          /* Graphite — base section background */
  --color-bg-alt: #313330;      /* (derived) subtle lighter graphite — alternate section background */
  --color-text: #F4F3EF;        /* Warm White — primary text */
  --color-text-muted: #B5B8B1;  /* Inverse Muted — secondary text, meta, captions */

  /* Accent */
  --color-accent: #A6BAFF;      /* Inverse Inquiry Blue — links, nav, general interactive/focus states */
  --color-action: #6BD98D;      /* Inverse Green — CTAs and action-oriented elements only */

  /* Structural (derived) */
  --color-border: rgba(181, 184, 177, 0.24);
  --color-border-strong: rgba(181, 184, 177, 0.4);

  /* CTA text override — exception, see note below */
  --color-cta-text: #0F172A;
  --color-cta-text-hover: #000000;
}
```

**Rules:**
- `--color-bg` and `--color-bg-alt` alternate section-by-section to give scroll rhythm (see §8, Section backgrounds). Keep the difference subtle — this is not a card/panel system, just a tonal shift.
- `--color-action` (green) is reserved for CTAs and action-oriented elements: primary button fill, CTA hover/focus states, active/confirmation indicators. Not for nav, not for decorative accents, not as a general highlight — keep it a clear "this is an action" signal, not a dominant site color.
- `--color-accent` (blue) covers everything else interactive: inline links, nav hover/active, focus rings on non-CTA elements, logo pupils.
- Never use `#147D40` / `#6BD98D` to recolor the logo itself (binding brand rule).
- **`--color-cta-text` / `--color-cta-text-hover` are a deliberate, scoped exception to the closed palette above** — added per a direct client requirement for the "Book Intro Call" button specifically. They're not derived from the brand palette and shouldn't be reused elsewhere; if another element needs a text-color override, treat it as its own decision, don't default to these.

---

## 2. Typography

**Primary site font: Fraunces** (Black weight, `soft` optical variant) — a free, open-source display serif in the same rounded-slab family Cooper was chosen for, hosted on Google Fonts. Resolved in place of Cooper: Cooper is a licensed face with no free source, and Fraunces ships without a procurement step. IBM Plex Mono (the logo's lettering font) is still reserved for CTA button labels and brand-highlight elements only — it is not the body or heading font.

```css
:root {
  --font-primary: "Fraunces", Georgia, serif;   /* headings, nav, section titles, card titles */
  --font-body: "IBM Plex Sans", sans-serif;      /* paragraph copy — bios, excerpts, legal text */
  --font-brand: "IBM Plex Mono", monospace;      /* CTA button labels, brand-highlight tags only */
}
```

Load Fraunces with its `opsz` (optical size) and `SOFT` variation axes available, or at minimum the `wght: 900` (Black) static cut with `font-variation-settings: "SOFT" 100;` if using the variable font — the soft setting is what gives it Cooper's rounded warmth instead of a stiff traditional serif.

Fraunces is used here for headings/titles, not body text — it's a display-weight face, and a display face at paragraph length hurts readability. Same reasoning as before, just with the new font name.

### Scale (mobile-first: base = mobile, arrow = desktop at `--bp-lg`)

Sizes reduced from the previous pass per the compact-layout direction. Hierarchy rule: **every heading level must render larger than the level below it, at every breakpoint.** A card or component title nested inside a section must never use a token equal to or larger than its parent section's title token — this is what caused the earlier hierarchy bug.

| Token | Font | Weight | Mobile → Desktop | Line-height | Use |
|---|---|---|---|---|---|
| `--text-display` | primary (Fraunces) | 900 (Black), soft | 2rem / 32px → 2.75rem / 44px | 1.15 | Hero H1 |
| `--text-h2` | primary (Fraunces) | 900 (Black), soft | 1.375rem / 22px → 1.75rem / 28px | 1.2 | Section titles |
| `--text-h3` | primary (Fraunces) | 900 (Black), soft | 1.0625rem / 17px → 1.25rem / 20px | 1.3 | Card/founder names |
| `--text-body` | body (Plex Sans) | 400 | 0.9375rem / 15px → 1rem / 16px | 1.6 | Paragraphs, bios, excerpts |
| `--text-label` | brand (Plex Mono) | 500 | 0.8125rem / 13px → 0.875rem / 14px | 1.4, letter-spacing 0.02em | Nav, buttons, tags, meta |
| `--text-small` | body (Plex Sans) | 400 | 0.75rem / 12px → 0.8125rem / 13px | 1.5 | Legal/footer fine print |

---

## 3. Spacing

Tightened from the previous pass for a more compact, refined layout — still mobile-first (base = mobile).

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
}
```

- Section vertical padding: `--space-8` mobile → `--space-16` desktop (was `--space-12`→`--space-24` — cut roughly in half).
- Container max-width: `1200px`, horizontal padding `--space-4` mobile → `--space-12` desktop.
- Card internal padding: `--space-4` (was `--space-6`).
- Avoid large empty gaps between sections beyond the padding above — the previous pass ran too spacious; tighten rather than pad.

---

## 4. Logo usage rules (binding)

- **Header/footer lockup:** full wordmark, dark-background treatment (`logo/wordmark/dark/99ways-wordmark-dark-background.svg`). Minimum visible width **180px**.
- **Compact contexts** (mobile nav collapsed, favicon-adjacent): `logo/compact/dark/99ways-compact-dark-background.svg`. Minimum visible width **64px**. Below that, use `icons/micro/*`, don't scale the compact master down further.
- **Clear space:** minimum 25% of the logo's rendered cap-height on all sides.
- **Never:** retype the wordmark as live text, alter letter spacing, move the two pupils independently, recolor with green, stretch/distort proportions, isolate a single "9," or place on a busy/low-contrast field without a neutral holding area.
- **Favicon:** `icons/favicon/99ways-favicon.svg` (built-in light/dark variants, use as-is).
- The logo's own font (IBM Plex Mono) now doubles as `--font-brand` for CTA labels — that's the "specific brand highlight" use case, not a coincidence; it's the intended way to echo the logo's type without using it for the wordmark itself.

---

## 5. Components

**Button — primary (CTA)**
- Background `--color-action`, text `--color-cta-text` (default `#0F172A`, hover `#000000` — see §1), font `--text-label` (Plex Mono, weight 600), padding `10px 24px` (was `12px 28px` — more compact), border-radius 2–4px.
- Hover/focus: background darkens ~10%, text color shifts to `--color-cta-text-hover`, focus ring in `--color-action` (not blue — CTAs stay in the green "action" channel end to end). No underline on hover — this button never gets one, regardless of how it's marked up (e.g. as an `<a>`).
- Applies to every instance of "Book Intro Call" (hero and pre-footer) — they're the same button, same styling, same behavior.

**Button — secondary/ghost**
- Transparent background, 1px `--color-border-strong` border, text `--color-text`, same padding/type as primary.
- Hover: border becomes `--color-accent`. No underline on hover (applies to "Contact Us" in the header).

**Link (inline/nav)**
- `--color-text` default, `--color-accent` on hover/active, no underline at rest, underline on hover.

**Link — "view all" / arrow link (new)**
- A distinct component from the generic inline link above — used for "View all posts" and similar "see more" links. `--color-text-muted` default, `--color-accent` on hover — text color shift, no underline at rest or on hover.
- Small arrow icon (→) positioned to the left of the text, hidden/transparent at rest, fades and slides in from the left on hover (150–200ms ease, per §7 Motion).

**Card (testimonial carousel / blog grid)**
- Background matches its parent section (`--color-bg` or `--color-bg-alt`, whichever the section is on), 1px `--color-border`, padding `--space-4`, no drop shadows.

**Carousel (testimonials — new)**
- 3 cards visible: center card at 100% opacity / 100% scale (focal), left and right cards at reduced opacity (~0.5–0.7) and reduced scale (derived: ~85–90%).
- **Card framing is a deliberate exception to the base Card component above:** no internal padding — image fills the card edge-to-edge, border hugs the image directly. Baseline container size: 385.75px × 140.83px (~2.74:1), derived from image #4.
- **Cropping:** zero horizontal cropping, ever — every image renders at full container width. Vertical overflow only is cropped, top-down (`object-position: top`). See `HOMEPAGE_SPEC.md` §4 for the full corrected rule and why a bare `object-fit: cover` isn't sufficient on its own.
- Transitions: directional horizontal slide, per §7 Motion timing (150–200ms — may need to run slightly longer for a slide of this distance; use judgment, keep it snappy, not floaty).
- Same carousel — same depth/scale treatment — on mobile and desktop. Don't swap to a flat filmstrip on small screens; adjust card sizing instead so 3-across still fits. Outer section container uses `overflow-x: hidden`; carousel must stay within `100vw` on all breakpoints, no page-level horizontal scroll.
- Lightbox dismissal: backdrop click, close button, and `Esc` key must all work.

**Avatar/photo (About Us and similar)**
- Cap size: 96px mobile → 128px desktop, circular crop. Deliberately small — the previous pass ran oversized imagery here; keep founder photos as identity markers, not hero-scale visuals.

**Divider**
- 1px, `--color-border`.

**Nav dropdown**
- **Desktop:** trigger label and its dropdown menu are one combined hover region — opens on `mouseenter` of that region, closes **immediately** on `mouseleave` of it, no delay/timer (a prior delay-based approach proved unreliable and has been dropped). Top-level trigger labels ("Services", "Resources") are not links and don't show a `pointer` cursor; items inside the open dropdown are normal links with `pointer`. A right-facing arrow (`>`) marks "Optimization Experiences" as having a nested submenu — same font/color as the row's text, right-aligned via flex (`justify-content: space-between`), purely visual on desktop, reveal is still hover-driven.
- **Mobile/tablet:** click/tap-triggered, accordion behavior — opening one top-level dropdown closes any other open one immediately, revealing only that trigger's direct children. "Optimization Experiences" uses a down-facing arrow (▾) as a genuinely separate DOM element/click-handler from its text label (each calling `stopPropagation()`): tapping the arrow toggles "Featured Experiments" via its own dedicated state, tapping the text navigates — neither should be derived from or coupled to "Resources"' own open state.

---

## 6. Section backgrounds

New requirement — sections alternate between `--color-bg` and `--color-bg-alt` so scroll position is visually legible without breaking the cohesive palette. Assignment (top to bottom):

| Section | Background |
|---|---|
| Header | `--color-bg` |
| Hero | `--color-bg` |
| Video ("How I Find") | `--color-bg-alt` |
| Testimonials carousel | `--color-bg` |
| About Us | `--color-bg-alt` |
| Academy blog grid | `--color-bg` |
| Pre-footer CTA | `--color-bg-alt` |
| Footer | `--color-bg` |

This replaces the earlier "flat background everywhere, hairlines only" rule — that rule is superseded by this alternating pattern. Keep the shift subtle (the two tokens above are close in value on purpose); don't introduce a third shade.

---

## 7. Motion

- Interactions: opacity/transform transitions only, 150–200ms ease, no bounce/spring easing.
- Logo pupil motion remains future work, not part of this release.
