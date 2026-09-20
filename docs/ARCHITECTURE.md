# ARCHITECTURE.md — Tech Stack, Design System, Assets & Site Structure

This is the technical source of truth for the 99ways.io codebase. It fully replaces `design.md`, `ASSET_MANIFEST.md`, and `HOMEPAGE_SPEC.md`.

---

## 1. Tech stack

- **Framework:** Astro, static-site-generation only. No CMS, no backend, no admin dashboard.
- **Content:** blog posts (99Ways Academy) are an **Astro Content Collection** — one Markdown/MDX file per post under `src/content/`, with frontmatter (title, url/slug, category + category URL, excerpt, image, author, date, comment count). Query with `getCollection()`, sort by date descending. All other homepage copy is static, hardcoded in components (per the verbatim-copy rule in `PRODUCT.md` §2) — it does not need a content collection of its own.
- **Assets:** brand assets (logos, icons, fonts) live under `assets/` in this repo (migrated wholesale from a separate brand-assets repo — same internal folder structure, now colocated). Content images (testimonial screenshots, founder photos, blog thumbnails, footer social icons) are NOT in `assets/` — they're sourced from the live WordPress site and re-hosted; see §6.
- **Fonts:** Fraunces (Google Fonts, no license step) + IBM Plex Sans + IBM Plex Mono (Google Fonts).
- **Theme:** dark only. No light mode, no toggle.

---

## 2. Design approach: mobile-first

Base styles are mobile values; desktop is a progressive enhancement layered on top via `min-width` media queries — never the other way around. Build and validate the mobile layout first for every component and section.

```css
:root {
  --bp-sm: 480px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
}
```

`--bp-lg` (1024px) is the "desktop" arrow-point used throughout the type scale below. `--bp-md` (768px) is the mobile/tablet split used for a few specific rules (e.g. the About Us divider, §5).

---

## 3. Design tokens

### Color

```css
:root {
  /* Base */
  --color-bg: #292B2A;          /* Graphite — base section background */
  --color-bg-alt: #313330;      /* subtle lighter graphite — alternate section background */
  --color-text: #F4F3EF;        /* Warm White — primary text */
  --color-text-muted: #B5B8B1;  /* Inverse Muted — secondary text, meta, captions */

  /* Accent */
  --color-accent: #A6BAFF;      /* Inverse Inquiry Blue — links, nav, general interactive/focus states */
  --color-action: #6BD98D;      /* Inverse Green — CTAs and action-oriented elements ONLY */

  /* Structural */
  --color-border: rgba(181, 184, 177, 0.24);
  --color-border-strong: rgba(181, 184, 177, 0.4);

  /* CTA text override — scoped exception, see note below */
  --color-cta-text: #0F172A;
  --color-cta-text-hover: #000000;
}
```

Rules:
- `--color-bg` / `--color-bg-alt` alternate section-by-section (see §5, Section backgrounds) for scroll legibility. Keep the shift subtle — never introduce a third shade.
- `--color-action` (green) is reserved for CTAs/action elements only: primary button fill, CTA hover/focus, confirmation indicators. Never for nav, decoration, or general highlighting.
- `--color-accent` (blue) covers everything else interactive: inline links, nav hover/active, non-CTA focus rings, logo pupils.
- Never recolor the logo itself with `#147D40` / `#6BD98D` (binding brand rule).
- `--color-cta-text` / `--color-cta-text-hover` are a **deliberate, scoped exception** to the closed palette above, added for the "Book Intro Call" button specifically. Not derived from brand palette, not reusable elsewhere — a different element needing a text-color override is its own decision, not a default to these two values.

### Typography

**Primary font: Fraunces** (Black/900 weight, `soft` optical variant) — free, open-source, Google Fonts. Chosen in place of Cooper (a licensed face with no free source) for the same rounded-slab display warmth without a procurement step. Load with `opsz`/`SOFT` variation axes, or at minimum `wght: 900` + `font-variation-settings: "SOFT" 100`.

IBM Plex Mono (the logo's own lettering font) is reserved for CTA labels and brand-highlight elements only — never body or heading text.

```css
:root {
  --font-primary: "Fraunces", Georgia, serif;   /* headings, nav, section titles, card titles */
  --font-body: "IBM Plex Sans", sans-serif;      /* paragraph copy — bios, excerpts, legal text */
  --font-brand: "IBM Plex Mono", monospace;      /* CTA button labels, brand-highlight tags only */
}
```

Fraunces is a display face — used for headings/titles only, never body text (hurts readability at paragraph length).

**Scale** (mobile-first: base = mobile, arrow = desktop at `--bp-lg`). Hierarchy rule, binding: **every heading level must render larger than the level below it, at every breakpoint.** A nested card/component title must never use a token equal to or larger than its parent section's title token.

| Token | Font | Weight | Mobile → Desktop | Line-height | Use |
|---|---|---|---|---|---|
| `--text-display` | Fraunces | 900, soft | 2rem/32px → 2.75rem/44px | 1.15 | Hero H1 |
| `--text-h2` | Fraunces | 900, soft | 1.375rem/22px → 1.75rem/28px | 1.2 | Section titles |
| `--text-h3` | Fraunces | 900, soft | 1.0625rem/17px → 1.25rem/20px | 1.3 | Card/founder names |
| `--text-body` | Plex Sans | 400 | 0.9375rem/15px → 1rem/16px | 1.6 | Paragraphs, bios, excerpts |
| `--text-label` | Plex Mono | 500 | 0.8125rem/13px → 0.875rem/14px | 1.4, ls 0.02em | Nav, buttons, tags, meta |
| `--text-small` | Plex Sans | 400 | 0.75rem/12px → 0.8125rem/13px | 1.5 | Legal/footer fine print |

### Spacing

```css
:root {
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-6: 24px; --space-8: 32px;  --space-12: 48px; --space-16: 64px;
  --space-24: 96px;
}
```

- Section vertical padding: `--space-8` mobile → `--space-16` desktop.
- Container: max-width `1200px`, horizontal padding `--space-4` mobile → `--space-12` desktop.
- Card internal padding: `--space-4` (default — some components override this, see §4).
- Compact by design — avoid large gaps beyond the padding above.

---

## 4. Components

**Logo usage (binding):**
- Header/footer lockup: full wordmark, `logo/wordmark/dark/99ways-wordmark-dark-background.svg`, min 180px.
- Compact contexts (mobile nav, favicon-adjacent): `logo/compact/dark/99ways-compact-dark-background.svg`, min 64px. Below that, use `icons/micro/*` — never scale the compact master down further.
- Clear space: min 25% of the logo's rendered cap-height, all sides.
- Never: retype as live text, alter letter spacing, move the pupils independently, recolor with green, stretch/distort, isolate a single "9," or place on a busy/low-contrast field with no neutral holding area.
- Favicon: `icons/favicon/99ways-favicon.svg` (built-in light/dark variants, use as-is).
- **Exception — Decorative Logo Field (below):** scoped exception to every rule above. Applies only to that one component, never as precedent elsewhere.

**Button — primary (CTA)**
- Background `--color-action`, text `--color-cta-text` (`#0F172A` default, `#000000` hover), font `--text-label` weight 600, padding `10px 24px`, border-radius 2–4px.
- Hover/focus: background darkens ~10%, text shifts to `--color-cta-text-hover`, focus ring `--color-action` (stays in the green channel, never blue). **No underline on hover, ever**, regardless of markup (`<a>` or `<button>`).
- Every "Book Intro Call" instance (hero, pre-footer) is this same button — same styling, same behavior.

**Button — secondary/ghost**
- Transparent background, 1px `--color-border-strong` border, text `--color-text`, same padding/type as primary.
- Hover: border → `--color-accent`. No underline on hover. Applies to "Contact Us" in the header.

**Link — inline/nav**
- `--color-text` default, `--color-accent` hover/active, no underline at rest, underline on hover.

**Link — "view all"/arrow link**
- Distinct from the generic inline link. Used for "View all posts" and similar. `--color-text-muted` default, `--color-accent` hover — color shift only, no underline at rest or hover.
- Small arrow icon (→), left of text, transparent at rest, fades/slides in from the left on hover (150–200ms ease).

**Card — blog grid**
- Background matches parent section (`--color-bg` or `--color-bg-alt`), 1px `--color-border`, padding `--space-4`, no drop shadows.

**Masonry — testimonials** (section was previously a 3D carousel — replaced for mobile breakage where the carousel caused horizontal page scroll on mobile viewports; the replacement is a static CSS multi-column masonry wall with no interaction). Section-level properties (background `--color-bg`, title "How Partners Review Us" with `--text-h2`, fonts, spacing, container width) are unchanged from the prior version and governed by §3/§5/§8.

- 9 images rendered as a static masonry grid using CSS multi-column layout. No auto-rotation, no lightbox, no hover/peek/scale states, no lightbox.
- **Column counts:** 3 columns desktop (≥900px), 2 columns tablet (560–899px), 1 column mobile (<560px). `column-gap: 14px`.
- **break-inside: avoid** on each tile to prevent image splitting across columns.
- **Per-image aspect-ratio** via CSS class matching each image's actual native dimensions (measured from source files):
  | Class | Width | Height | File |
  |---|---|---|---|
  | `.r-1` | 796 | 226 | `01-funnel-optimization.webp` |
  | `.r-2` | 686 | 221 | `02-ecommerce-analytics-cro.webp` |
  | `.r-3` | 794 | 198 | `03-marketing-cro-consultation.webp` |
  | `.r-4` | 797 | 283 | `04-cro-quick-job.webp` |
  | `.r-5` | 794 | 531 | `05-posthog-analytics.webp` |
  | `.r-6` | 795 | 737 | `06-cro-coaching-business.webp` |
  | `.r-7` | 794 | 226 | `07-cro-posthog.webp` |
  | `.r-8` | 795 | 274 | `08-course-marketing-funnel.webp` |
  | `.r-9` | 794 | 328 | `09-saas-posthog-setup.webp` |
- **object-fit: cover** on images as a safety net if a delivered image doesn't exactly match its declared ratio.
- Images sourced via `astro:assets` `<Image />` with `loading="lazy"`.
- Component: `TestimonialsMasonry.astro` — imports from `src/assets/testimonials/`, no client-side JavaScript.
- **Historical note:** This section previously used a 3D carousel (`TestimonialsCarousel.astro`, now deleted) with auto-rotation (~5s), peek/scale states for side cards (~0.5–0.7 opacity, ~85–90% scale), and a full-screen lightbox. The carousel caused horizontal page-level scroll on mobile (375px–414px viewports). The masonry replacement resolves this while preserving the identical section wrapper (background, title, fonts, spacing, container width).

**Avatar/photo — About Us and similar**
- Cap size: 96px mobile → 128px desktop, circular crop. Deliberately small — identity markers, not hero-scale visuals.

**Divider**
- 1px, `--color-border`. (The About Us section has a breakpoint-specific application of this — see §5.)

**Nav dropdown**
- **Desktop:** trigger label + its dropdown menu = one combined hover region. Opens on `mouseenter`, closes **immediately** on `mouseleave` of that combined region — no delay, no timer (a prior delay-based approach was unreliable and was dropped). This holds whether the cursor exits toward empty space or moves directly to a different top-level trigger. Top-level labels ("Services", "Resources") are triggers only — not links, default cursor (not `pointer`). Items inside an open dropdown are normal links with `pointer`. "Optimization Experiences" gets a right-facing arrow (`>`) — same font/color as the row's text (`--text-label`, not a generic icon glyph), right-aligned via `display: flex; justify-content: space-between` (not trailing inline flow, which lets it drift off the true right edge). Purely visual on desktop — reveal stays hover-driven.
- **Mobile/tablet:** click/tap-triggered accordion — opening one top-level dropdown closes any other immediately, revealing only that trigger's direct children (nothing nested deeper). "Optimization Experiences" uses a down-facing arrow (▾) as **two genuinely separate DOM elements with two separate click handlers**, each calling `stopPropagation()`: the arrow element toggles a dedicated `isFeaturedExperimentsOpen`-type state and does nothing else (no navigation); the text label navigates to `/category/optimization-experience/` and does nothing else (never reads/toggles the submenu state). "Featured Experiments" visibility is driven only by the arrow's own state — never derived from or coupled to "Resources"' own open state. This exact behavior has broken twice in implementation from an under-specified version of this rule — implement precisely as described, not approximately.
- "Featured Experiments": hidden by default always. Desktop reveals on hover of "Optimization Experiences." Mobile/tablet reveals only via the arrow tap above.

**Decorative Logo Field** (Hero background texture — the resolved hero-visual decision):
- **Purpose:** atmospheric, non-brand-functional background texture from many small repeated instances of the compact/micro logo mark. Decoration, not a logo lockup — see the scoped exception in the Logo usage rules above.
- **Asset:** `assets/icons/micro/99ways-compact-micro-32px-dark-background-2x.png` only — never the wordmark or full compact master.
- **Implementation shape:** a generic reusable component (e.g. `DecorativeLogoField`) rendering N positioned `<img>`/background instances absolutely inside a `position: relative` wrapper spanning the host section — not a single flattened background image. Every instance's position/size/rotation/opacity independently adjustable, per breakpoint.
- **Protected zone:** the host section's foreground content bounding box + clearance buffer (`--space-8` mobile, `--space-12` desktop) — no decorative instance may enter this, even partially, at any breakpoint. Recalculated per breakpoint against actual rendered content size, never hardcoded coordinates.
- **Distribution:** concentrated outside the protected zone, organic non-grid placement (hand-tuned or seeded-random per breakpoint tier) — avoid visually obvious repetition of the same size+rotation+opacity combo more than once or twice per viewport.
- **Size range:** ~24–32px small end to ~120–180px large end, mixed within the same field. Configurable min/max.
- **Rotation range:** ~±15–25° per instance.
- **Opacity range:** faint — most instances ~4–12%, a few of the largest up to ~15–18%. Never more visually prominent than the section's own `--color-border` hairlines or muted text; when in doubt, go fainter.
- **Edge bleed:** instances may sit partially outside the host section's bounds. Host section uses `overflow: hidden` — bled instances never introduce page-level scroll, any breakpoint.
- **Static, no exceptions:** no animation/transition/parallax/drift/float/spin/hover motion, ever, any breakpoint. Pure static `position` + `transform: rotate()` + `opacity`.
- **Responsive density:** ~8–12 instances mobile, ~16–20 tablet, ~24–30 desktop. Prefer reducing count over shrinking size on smaller breakpoints.
- **Configurability:** density, size range, opacity range, rotation range, protected-zone buffer all adjustable from one place (props/config object/CSS custom properties) — not scattered inline through markup.
- **Reuse:** generic enough for other sections to mount their own instance later with their own protected-zone bounds and density config. Only the Hero uses it currently.

---

## 5. Section backgrounds

Sections alternate `--color-bg` / `--color-bg-alt` for scroll-position legibility, without breaking the cohesive palette:

| Section | Background |
|---|---|
| Header | `--color-bg` |
| Hero | `--color-bg` |
| Video ("How I Find") | `--color-bg-alt` |
| Testimonials masonry | `--color-bg` |
| About Us | `--color-bg-alt` |
| Academy blog grid | `--color-bg` |
| Pre-footer CTA | `--color-bg-alt` |
| Footer | `--color-bg` |

Keep the shift subtle (the two tokens are intentionally close); never introduce a third shade.

---

## 6. Motion

- Interactions: opacity/transform transitions only, 150–200ms ease, no bounce/spring easing.
- Logo pupil motion: future work, not in scope.
- Decorative Logo Field: explicitly excluded from all motion — static only, regardless of viewport or interaction state.

---

## 7. Asset manifest

Paths relative to `assets/` in this repo (migrated wholesale from the original brand-assets repo, same internal structure).

### Confirmed available

| Use | Path | Notes |
|---|---|---|
| Header/footer wordmark (dark) | `assets/logo/wordmark/dark/99ways-wordmark-dark-background.svg` | 455.7135 × 129.6533 viewBox. Min render width 180px. |
| Compact mark (dark) | `assets/logo/compact/dark/99ways-compact-dark-background.svg` | 146 × 101 viewBox. Min render width 64px. |
| Favicon | `assets/icons/favicon/99ways-favicon.svg` | Built-in light/dark `prefers-color-scheme` variants — use directly. |
| Apple touch icon | `assets/icons/apple-touch/99ways-apple-touch-icon-180.png` | 180×180, opaque Warm White field. |
| Hero Decorative Logo Field mark | `assets/icons/micro/99ways-compact-micro-32px-dark-background-2x.png` | Used **only** by the Decorative Logo Field component. Not a functional logo lockup — never use for header/footer/nav/favicon. Single source raster, restyled per-instance via CSS; don't re-export additional sizes. |

### Available but unused in the current spec

- `raster/wordmark/` and `raster/compact/` — PNG fallbacks (1024w/2048w, 512/1024 square) if SVG isn't viable somewhere.
- `social/avatar/99ways-avatar-warm-white-1024.png` — square profile avatar, not a homepage element.
- `icons/micro/*` — 16/24/32/48px optical derivatives for favicon-scale contexts below the compact mark's 64px floor (the 32px/2x variant is the one used by the Decorative Logo Field, see above; the rest remain unused).
- `masters/` — editable source SVGs. **Never ship these to production** — design-edit sources only.

### NOT in the brand repo — sourced from the live WordPress site, re-hosted

No CMS import path exists in this Astro-only stack — these were downloaded and re-hosted under `src/assets/` (for `astro:assets` optimization) or `public/` as appropriate. Paired with their Astro content-collection entry rather than hardcoded inline, where applicable.

**Testimonials masonry, 9 images, display order:**
1. `Screenshot-2025-10-21-at-11.46.12.webp`
2. `Screenshot-2025-10-20-at-20.10.05-e1761003445793.webp`
3. `Screenshot-2025-10-21-at-11.39.31.webp`
4. `Screenshot-2025-10-21-at-11.40.23.webp`
5. `Screenshot-2025-10-21-at-11.33.00.webp`
6. `Screenshot-2025-10-21-at-11.29.51.webp`
7. `Screenshot-2025-10-21-at-11.37.38.webp`
8. `Screenshot-2025-10-21-at-11.47.35.webp`
9. `Screenshot-2025-10-21-at-11.46.37.webp`

(Originally hosted at `https://99ways.io/wp-content/uploads/2026/07/` + each filename above.)

**About Us photos:**
- Iman Nazari: `2026-05-26-17.45.07.jpg`
- Moein Heshmati: `cropped_circle_image-9.webp`

(Originally hosted at `https://99ways.io/wp-content/uploads/2026/07/` + each filename above.)

**Academy blog post thumbnails** (pulled from each post's og:image):
- "Story of 74% CVR lift..." → `Gemini_Generated_Image_2x5sm32x5sm32x5s.webp`
- "Why Experimentation Is a Must-Have..." → `Gemini_Generated_Image_t2bh23t2bh23t2bh.webp`
- "Confidence vs PostHog..." → `Gemini_Generated_Image_wwkt3twwkt3twwkt.webp`

(Originally hosted at `https://99ways.io/wp-content/uploads/2026/09/` + each filename above.)

**Footer social icons:** GitHub and LinkedIn were already correct on a prior pass; Upwork (×2), Fiverr, and Medium needed replacing with real brand icons:
- LinkedIn: `LinkedIn_icon.svg_.webp` (from `.../2025/10/`)
- Iman's Upwork: `upwork-roundedsquare-1.webp` (from `.../2026/07/`)
- Agency's Upwork (**intentionally a different source file from Iman's** — preserve that distinction, never collapse to one shared icon): `Untitled-design-20-1.webp` (from `.../2026/07/`)
- Fiverr: `Fiverr_Logo_fiverr.webp` (from `.../2026/07/`)
- GitHub: `5968866.png` (from `.../2025/11/`)
- Medium: `medium-logo-icon.webp` (from `.../2026/07/`)

**Video:** YouTube embed, ID `STouQwJZ4bY` — no local asset, embed directly.

**Fraunces webfont:** Google Fonts (`https://fonts.google.com/specimen/Fraunces`) — no licensing step, `<link>`/`@import` or self-host the variable font file.

### Explicitly removed — do not source

- Frog mascot image and its cropped favicon variant — dropped per brand decision.
- Google Maps embed assets/API key — component removed, no longer needed.

---

## 8. Site structure — Homepage

Global layout: container max-width `1200px`, centered, responsive padding per §3. Mobile-first build order. Sections separated by the compact vertical rhythm in §3 — don't over-pad.

### Header (sticky)
Background `--color-bg`. 1px `--color-border` bottom edge only (required — Hero directly below also uses `--color-bg`; without this line the two sections visually merge).

Structure: logo (left) — nav (center/right) — CTA (right).
- Logo: full wordmark, min 180px; mobile/collapsed → compact mark, min 64px.
- Favicon: `icons/favicon/99ways-favicon.svg`.
- Nav dropdown behavior: see §4 (Components — Nav dropdown) for the full corrected spec.
- Nav items (`--text-label`):
  - **Services** (trigger, no direct link): Conversion Rate Optimization → `/hire-cro-expert/` · PostHog & Product Analytics → `/hire-posthog-expert-guide/` · Hyros & Tracking Setup → `/hire-hyros-expert-guide/`
  - **Resources** (trigger, no direct link): Guides and How-tos → `/category/guides-how-to/` · PostHog Feature Breakdowns → `/category/posthog-feature-breakdown/` · Tools Comparison → `/category/tools-comparison/` · Optimization Experiences → `/category/optimization-experience/` (split tap-target on mobile, see §4) → nested: Featured Experiments → `/category/optimization-experience/featured-experiments/` (hidden until revealed)
- CTA (ghost button): "Contact Us" → `/contact-form/`. No underline on hover.
- Clear space around logo per §4 — nav items must not crowd it.

### Hero
Background `--color-bg`. Layout: fully centered single column (headline, subhead, CTA).

- **Decorative Logo Field** background texture behind the centered column — see §4 for full component spec. Asset: `assets/icons/micro/99ways-compact-micro-32px-dark-background-2x.png`. Protected zone = the centered headline+subhead (max-width ~640px) + CTA column, plus clearance buffer. Static only, responsive density, `overflow: hidden` on the section.
- Headline (`--text-display`, centered):
  > Find and Pull Your Biggest Growth Levers with Experimentation
- Subhead (`--text-body`, `--color-text-muted`, centered, max-width ~640px):
  > We run your CRO operation, from research and prioritization to implementation and analysis.
- CTA (primary button, centered below subhead): **"Book Intro Call"** → `[TODO: no destination yet — booking tool not set up, ship as placeholder]`. Text color `#0F172A` default / `#000000` hover, no underline.

### "How I Find CRO Breakthroughs Again and Again"
Background `--color-bg-alt`. Section title (`--text-h2`), verbatim. YouTube embed, ID `STouQwJZ4bY`, standard responsive 16:9 container, thin `--color-accent` border (1–2px), no other decoration.

### "How Partners Review Us"
Background `--color-bg`. Masonry image wall spec in §4 (Components — Masonry). Section title (`--text-h2`), verbatim.

9 reviews, order and alt text (preserve exactly, do not shorten):
1. `Client review: Funnel Optimization Assessment and Recommendations`
2. `Client review: E-commerce analytics, CRO, and A/B testing`
3. `Client review: Marketing and conversion rate optimization consultation`
4. `Client review: Conversion Rate Optimization Expert quick job`
5. `Client review: PostHog and Analytics Expert`
6. `Client review: Conversion Rate Optimization for Coaching Business`
7. `Client review: Conversion Rate Optimization and PostHog`
8. `Client review: Course Marketing Funnel Manager`
9. `Client review: SaaS Google Analytics and PostHog setup`

### About Us
Background `--color-bg-alt`. Section title: "About Us" (`--text-h2`).

Layout: two-column founder cards side by side (desktop), stacked (mobile). Divider: **hidden below `--bp-md` (768px); vertical 1px `--color-border` at `--bp-md` and above** (tablet gets the identical treatment as desktop). A vertical divider only reads correctly if the cards are already side-by-side at that width — if tablet still stacks them, the card layout itself must switch to side-by-side at `--bp-md`, not just the divider.

Photos: 96px mobile / 128px desktop, circular crop — identity-scale, not hero-scale.

**Card 1 — Iman Nazari**, Co-Founder — Strategy & Experimentation:
> Iman connects what most teams keep separate: technology, business, and human behavior. He is the strategic force behind 99Ways' approach to conversion; translating user psychology, product reality, and commercial goals into decisions that actually improve performance. Where others guess at what customers want, Iman looks for signal: how people think, what drives action, and which changes measurably move results. He is relentless about clean measurement, sound inference, and experiments you can trust. For him, better decisions start with better evidence. Every metric must be credible, every insight must survive scrutiny, every test must produce learning; not noise. That is the foundation of 99Ways: reliable data, sharper understanding, and changes proven before they are scaled.

**Card 2 — Moein Heshmati**, Co-Founder — Data Systems & Engineering:
> Moein turns complexity into order. He's the architect behind 99Ways' tracking, reporting, and deployment systems; ensuring every insight is built on verified data and reproducible results. Where others chase creative flair, Moein builds structure: repeatable processes, documented workflows, and flawless implementation. He treats precision as a form of respect, for data, for the client, and for the truth. Nothing escapes his attention. Every number must reconcile, every change must be traceable, every system must work exactly as intended. That discipline is what allows 99Ways to move fast without breaking things.

### "Latest from 99Ways Academy"
Background `--color-bg`. Implementation: Astro Content Collection, `getCollection()` sorted by date descending, latest 3 shown. **The 3 real posts below must be what's actually rendering — verify no scaffold/placeholder content before considering this done** (this has broken before via framework-default placeholder content).

Layout: 3-column grid desktop, 1-column stacked mobile. Card structure top to bottom: image → clickable category tag (→ archive page) → title (links to post) → metadata line (`By [Author] • [Date] • [Comment Count]`) → excerpt (clamped ~3 lines).

1. **Story of 74% CVR lift in 6 months for a health brand** → `/health-brand-case-study/` · Category: Uncategorized → `/category/uncategorized/` · By Iman Nazari • September 11, 2026 • 0 Comments
   Image: `Gemini_Generated_Image_2x5sm32x5sm32x5s.webp` (see §7)
   > I owned CRO and experimentation for a high-volume consumer-health funnel, which included from research and measurement through test design, implementation,…
2. **Why Experimentation Is a Must-Have for Your Business** → `/why-experimentation-is-important-for-business/` · Category: Guides and How-tos → `/category/guides-how-to/` · By Iman Nazari • September 11, 2026 • 0 Comments
   Image: `Gemini_Generated_Image_t2bh23t2bh23t2bh.webp` (see §7)
   > Business experimentation is more than choosing a winning page. It reveals which customer problems deserve investment, which ideas should stop, and where to commit resources with evidence.
3. **Confidence vs PostHog: Which Experimentation Platform Fits Your Team?** → `/confidence-vs-posthog/` · Category: Tools Comparison → `/category/tools-comparison/` · By Iman Nazari • September 9, 2026 • 0 Comments
   Image: `Gemini_Generated_Image_wwkt3twwkt3twwkt.webp` (see §7)
   > An evidence-based Confidence vs PostHog comparison covering data architecture, statistical methods, guardrails, governance, pricing, tradeoffs, and a practical evaluation plan.

The other 3 posts in the collection (not shown on the homepage — documented here for completeness):
4. **PostHog Implementation for Growth Lever Teams** → `/posthog-implementation/` · PostHog Feature Breakdowns
   > A useful PostHog implementation is not an SDK installation or feature tour. It is a decision system connecting business-aware events, identity, acquisition, revenue, experiments, and QA so a growth team can identify a lever, act on it, and validate the result.
5. **A/B Testing Metrics: Choose the Primary Metric Closest to Profit** → `/ab-testing-metrics/` · Guides and How-tos
   > The best A/B testing metric is usually the measurable outcome closest to incremental contribution per eligible visitor, user, or account. This guide separates true decision metrics, operational primaries, leading indicators, guardrails, and diagnostics—then maps ecommerce, subscription, pricing, lead-generation, marketplace, and cost-changing experiments to the metrics that should actually determine the winner.
6. **CRO Redesign vs Ongoing A/B Testing: Which to Start With?** → `/cro-redesign-vs-ab-testing/` · Guides and How-tos
   > A tested one-time redesign can be rational when the current experience needs a structural reset. Ongoing A/B testing creates more long-term value when each experiment produces both deployed impact and reusable customer learning. This framework shows how to choose—and why one hypothesis does not mean changing only one UI element.

Footer link: "View all posts" → `/academy/` (arrow-link component, see §4).

### Pre-footer CTA
Background `--color-bg-alt`. **Required section**, not present on the original WordPress site — added as a second conversion point on a content-light page. Reuses existing CTA copy only, no new text.

Placement: immediately after Academy grid, immediately before footer. Full-width band, single centered column. Optional label above the button must reuse existing site copy verbatim or be omitted — never new copy. Button: "Book Intro Call" — same target/styling/color-override as the hero CTA. Section padding: `--space-8` mobile → `--space-16` desktop (compact, not an oversized "hero moment").

### Footer
Background `--color-bg`. Compact mark only (not full wordmark), min 64px.

Three link columns, verbatim:
- **Resources:** Guides and How-tos → `/category/guides-how-to/` · PostHog Feature Breakdowns → `/category/posthog-feature-breakdown/` · Tools Comparison → `/category/tools-comparison/` · Optimization Experiences → `/category/optimization-experience/` · Featured Experiments → `/category/optimization-experience/featured-experiments/`
- **Services:** PostHog & Product Analytics → `/hire-posthog-expert-guide/` · Hyros & Tracking Setup → `/hire-hyros-expert-guide/` · CRO → `/hire-cro-expert/`
- **About Us:** Contact Us → `/contact-form/` · Iman's Upwork → `https://www.upwork.com/freelancers/imannazari` · Agency's Upwork → `https://www.upwork.com/agencies/1718792436665155584/` · Fiverr → `https://www.fiverr.com/ishto7` · GitHub → `https://github.com/99ways-io` · LinkedIn → `https://www.linkedin.com/company/99ways-io/` · Medium → `https://medium.com/nes-stories` · Google Maps → `https://maps.app.goo.gl/daoBjTCZu7YghnJj9`

**No Google Maps embed** — removed by deliberate decision. The plain external "Google Maps" text link above stays; only the embedded widget is cut. Social icons row (`--color-text-muted`, hover `--color-accent`): LinkedIn, Iman's Upwork, Agency's Upwork, Fiverr, GitHub, Medium — real icon sources in §7.

Legal text (`--text-small`), verbatim:
> *Ninety Nine Ways* is a registered trademark of Nazari Ecom Solutions. Nazari Ecom Solutions is registered with the Dutch Chamber of Commerce (KvK) under registration number 91552451. Office: Mr. Treublaan 7, 1097 DP Amsterdam, The Netherlands. VAT Identification Number: NL004899587B87.

Copyright line: "2025 99Ways | All right reserved." — Privacy Policy (`/privacy-policy/`) | Terms of Service (`/terms-of-use/`)

### Explicitly out of scope for this pass
See `PRODUCT.md` §4 for the full, maintained list (cookie banner, email-gate modal, logo pupil animation, light theme, Google Maps embed, Decorative Logo Field motion).
