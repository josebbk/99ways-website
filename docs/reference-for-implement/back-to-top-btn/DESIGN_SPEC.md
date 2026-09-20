# Back-to-Top Button — Design A: "The Dot"

Source of truth for this component. Preview: `design-a.html` (open directly in a browser, scroll down).

## 1. Concept

The logo isn't a wordmark that needs a matching icon — it already contains a
usable UI element: the small blue dot inside each "9" (the counter, drawn
with a thin charcoal ring around it like an eye). This component **is** that
dot, scaled up into a button:

- The button body is a charcoal circle (`#292b2a`), same family as the
  numeral fill.
- The blue dot sits fixed near the top-left of the circle, same relative
  position as the counter sits inside the glyph, with the same charcoal
  "gap ring" separating it from the fill.
- A thin blue arc around the button's edge is not decoration — it's a
  scroll-progress meter, filling as the user scrolls down and draining as
  the page returns to the top.
- The only two animations are both tied to something the user did:
  1. **Entrance** — one overshoot "pop" the first time the button is needed
     (crossing the show threshold), not a fade that repeats.
  2. **Wink** — a quick vertical pinch on the dot when the pointer enters
     the button, referencing the dot itself rather than a generic
     bounce/glow hover.

No looping/idle animation, no unrelated iconography.

## 2. Anatomy (DOM structure)

```html
<button class="btt" id="btt" type="button" aria-label="Back to top">
  <svg class="btt-ring" viewBox="0 0 56 56" aria-hidden="true">
    <circle class="track" cx="28" cy="28" r="25.5"></circle>
    <circle class="progress" id="bttProgress" cx="28" cy="28" r="25.5"></circle>
  </svg>
  <span class="btt-core">
    <svg class="btt-arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 19V5"></path>
      <path d="M6 11l6-6 6 6"></path>
    </svg>
  </span>
  <span class="btt-dot" aria-hidden="true"></span>
</button>
```

- `.btt-ring` — SVG, two concentric circles: a low-opacity `track` and the
  bright `progress` arc, driven by `stroke-dashoffset`.
- `.btt-core` — the charcoal circle body + arrow icon.
- `.btt-arrow` — a simple up-chevron, stroke-based (not filled), so its
  weight can match the numeral's stroke language.
- `.btt-dot` — the quoted logo element, absolutely positioned, independent
  of the arrow.

Keep the button a real `<button>` element (not a `<div>`) for built-in
keyboard and screen-reader semantics — no extra ARIA needed beyond
`aria-label`.

## 3. Design tokens

| Token | Value | Source / use |
|---|---|---|
| `--ink` | `#1d1e1d` | body text color in the preview only |
| `--ink-soft` | `#292b2a` | button fill (matches numeral color, sampled from logo) |
| `--ink-deep` | `#131413` | button fill on hover/press |
| `--blue` | `#3558b8` | dot + progress ring (sampled from logo) |
| `--blue-bright` | `#5c7fe0` | dot + focus ring on hover/focus |
| `--ring-track` | `rgba(53,88,184,0.18)` | the unfilled part of the progress ring |
| `--btn-size` | `56px` | overall button diameter |
| `--dot-size` | `9px` | blue dot diameter |

Colors were sampled directly from the supplied logo PNG
(`#292b2a` charcoal, `#3558b8` blue) — if the brand has an official palette
that differs slightly from the rasterized sample, swap these two hexes for
the canonical values and everything else (opacities, the `-bright` hover
variant) still holds proportionally.

## 4. Timings & easing

| Interaction | Property | Duration | Easing |
|---|---|---|---|
| Entrance pop | `opacity` | 350ms | `ease` |
| Entrance pop | `transform: scale` | 550ms | `cubic-bezier(.34, 1.56, .64, 1)` (overshoot) |
| Return-to-hidden (after click, on arrival) | `opacity`, `transform` | 400–450ms | `cubic-bezier(.5, 0, .75, 0)`, 50ms delay |
| Hover wink (`.btt-dot`) | `transform: scaleY` | 420ms | `ease`, keyframes 0% → 40% (pinch) → 70% (overshoot) → 100% |
| Click flick (`.btt-arrow`) | `transform: translateY`, `opacity` | 500ms | `ease`, keyframes with a quick double-nudge |
| Progress ring fill | `stroke-dashoffset` | 120ms | `linear` (tracks scroll continuously, so it stays snappy, not eased) |
| Hover elevation (`.btt-core`) | `transform`, `box-shadow`, `background` | 180–250ms | `ease` |

Show threshold: button appears once `window.scrollY > 320px`. Adjust the
`SHOW_AT` constant, not the animation timings, if the trigger point needs
to change.

## 5. SVG vectors

**Arrow icon** (`viewBox="0 0 24 24"`, stroke-based, no fill):
```svg
<path d="M12 19V5"></path>
<path d="M6 11l6-6 6 6"></path>
```
Stroke width `2.6`, `stroke-linecap: round`, `stroke-linejoin: round`,
color `#f2f1ee` (off-white, not pure white — keeps it from popping too hard
against the charcoal).

**Progress ring** (`viewBox="0 0 56 56"`): two circles, `cx=28 cy=28
r=25.5`, `stroke-width: 2.5`, no fill. `r=25.5` was chosen so the ring sits
just inside the 56px button with a hairline margin — if `--btn-size`
changes, recompute `r = (btn-size / 2) - 2.5` and update both the SVG
`viewBox`/circle attributes and the JS `R` constant together (see §6).

## 6. Behavior / JS logic

Three independent pieces of state, all driven off one `scroll` listener
(throttled via `requestAnimationFrame`):

1. **Visibility** — boolean, toggled by crossing `SHOW_AT`. Adds/removes
   `.is-visible`, which the CSS transition on `.btt` handles.
2. **Progress** — `scrollTop / (scrollHeight - clientHeight)`, clamped
   `0–1`, converted to `stroke-dashoffset = circumference * (1 - pct)` on
   the `.progress` circle. Recomputed every scroll frame — this is the one
   animation that's continuous rather than a discrete state change, because
   it's a meter, not a flourish.
3. **Click** — smooth-scrolls to top via `window.scrollTo({top:0,
   behavior:'smooth'})`, and adds `.is-launching` (plays the arrow flick)
   and `.is-returning` (plays the reverse of the entrance) immediately on
   click, not on scroll-arrival — the button leaves right away rather than
   waiting for the scroll animation to finish, since a lingering button
   during its own dismissal reads as a bug.

`prefers-reduced-motion: reduce` strips the scale/overshoot transforms and
all keyframe animations, keeping only opacity fades and an instant (non-
smooth) scroll-to-top. This is a hard requirement, not optional polish —
keep the media query block intact wherever this ships.

## 7. Translating to Astro

Target structure:

```
src/
  components/
    BackToTop.astro
```

Steps for the CLI agent:

1. **Create `src/components/BackToTop.astro`.** Move the `<button class="btt">…</button>`
   markup from `design-a.html` into the component's template section
   unchanged.
2. **Move the entire `<style>` block** (everything under "COMPONENT:
   back-to-top button" plus the tokens in `:root` that it depends on —
   `--ink-soft`, `--ink-deep`, `--blue`, `--blue-bright`, `--ring-track`,
   `--btn-size`, `--dot-size`) into the component's `<style>` block. Astro
   scopes component styles automatically, so class names don't need
   renaming or namespacing.
   - If the project already has a global `:root` token file (e.g.
     `src/styles/tokens.css`), add these six variables there instead of
     redeclaring them locally, so the button stays in sync with any future
     palette change. Otherwise declare them at the top of the component's
     `<style>` block as-is.
3. **Move the `<script>` IIFE** into the component using Astro's `<script>`
   tag (not `is:inline` — let Astro process/bundle it):
   ```astro
   <script>
     // paste the IIFE from design-a.html here, minus the
     // demo-only jumpMid/jumpEnd/jumpTop block at the bottom
   </script>
   ```
   Astro bundles page-level `<script>` tags per-page by default, which is
   correct here: the button is typically rendered once in a shared layout,
   so the listener attaches once.
4. **Drop the demo-only chrome** — `.demo-header`, `.demo-progress`,
   `.control-panel`, and the Lorem Ipsum `<main>` content are only in
   `design-a.html` to make the button testable in isolation. None of it
   belongs in the component.
5. **Mount it once**, in the shared layout (e.g. `src/layouts/Layout.astro`
   or `BaseLayout.astro`), right before `</body>`, so it's present on every
   page:
   ```astro
   ---
   import BackToTop from '../components/BackToTop.astro';
   ---
   ...
   <BackToTop />
   </body>
   ```
6. **Verify on a real long page** that:
   - the button appears only after ~320px of scroll,
   - the ring position tracks scroll % on a page with a realistic
     `scrollHeight` (not just the Lorem Ipsum demo length),
   - keyboard `Tab` reaches the button and `Enter`/`Space` triggers it,
   - `prefers-reduced-motion` (toggle via OS or browser devtools) removes
     the pop/wink/flick but keeps the button functional.
7. Do not port the base64-embedded logo `<img>` — that was only in the
   preview header for reference. The Astro site presumably already has its
   own `<img>`/logo component elsewhere.

## 8. Known parameters to revisit with the client

- `SHOW_AT = 320` — arbitrary; confirm against the real site's typical
  fold height rather than the demo page.
- Bottom/right offset (`28px`) — confirm against the site's grid/safe-area,
  especially if there's a chat widget or cookie banner that could collide
  with the same corner.
- Off-white arrow color `#f2f1ee` — intentionally not pure white; revisit
  if the brand has a defined "paper" or "off-white" token already.
