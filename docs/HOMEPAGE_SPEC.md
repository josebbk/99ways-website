# 99Ways — Homepage Specification

Applies `design.md` (formerly `DESIGN_SYSTEM.md` — consolidated, see that file). All copy below is **verbatim from the current live site** — do not rewrite, rephrase, or expand it. Where a copy field is genuinely missing (not just unstyled), it's marked `[TODO: ...]` — do not invent replacement text for those either; flag back to a human.

Asset paths reference `ASSET_MANIFEST.md`.

---

## 0. Global layout

- Mobile-first: build and validate the mobile layout first, then adapt up to tablet/desktop per `design.md`'s breakpoint tokens — desktop is not the reference point.
- Container max-width `1200px`, centered, responsive padding per `design.md` §3.
- Background alternates per section per `design.md` §6 (`--color-bg` / `--color-bg-alt`) — each section below states which one it uses.
- Sections separated by the compact vertical rhythm in `design.md` §3 (tightened from the previous pass — don't over-pad).

---

## 1. Header (sticky)

**Background:** `--color-bg`.

**Structure:** logo (left) — nav (center/right) — CTA (right)

- Logo: `logo/wordmark/dark/99ways-wordmark-dark-background.svg`, full wordmark, min 180px width. On mobile/collapsed nav, swap to `logo/compact/dark/99ways-compact-dark-background.svg`, min 64px.
- Nav items (`--text-label` styling), preserve structure and links exactly:
  - **Services** (dropdown)
    - Conversion Rate Optimization → `/hire-cro-expert/`
    - PostHog & Product Analytics → `/hire-posthog-expert-guide/`
    - Hyros & Tracking Setup → `/hire-hyros-expert-guide/`
  - **Resources** (dropdown)
    - Guides and How-tos → `/category/guides-how-to/`
    - PostHog Feature Breakdowns → `/category/posthog-feature-breakdown/`
    - Tools Comparison → `/category/tools-comparison/`
    - Optimization Experiences → `/category/optimization-experience/`
      - Featured Experiments → `/category/optimization-experience/featured-experiments/`
- CTA button (secondary/ghost style): **"Contact Us"** → `/contact-form/`
- Clear space around logo per `design.md` §4 — do not let nav items crowd it.

---

## 2. Hero

**Background:** `--color-bg`.

**Layout: fully centered.** Headline, subhead, and CTA are all center-aligned as a single centered column (this replaces any left-aligned/split layout from the previous pass — with the mascot gone, there's no asymmetric visual to balance against).

- No mascot/illustration and no replacement graphic in this pass — center column is text + CTA only. **Decided: ship text-only for this round; the hero visual is a fast-follow, not a blocker.** Revisit once the site is live if it feels too bare on wide desktop viewports.
- Headline (`--text-display`, `--color-text`, centered):
  > Find and Pull Your Biggest Growth Levers with Experimentation
- Subhead (`--text-body`, `--color-text-muted`, centered, max-width ~640px so it doesn't stretch full-width on desktop):
  > We run your CRO operation, from research and prioritization to implementation and analysis.
- CTA (primary button style, centered below subhead): **"Book Intro Call"** → `[TODO: no destination yet — deliberately deferred, ship as a non-functional/placeholder link this round, wire up once a booking tool is set up]`

---

## 3. "How I Find CRO Breakthroughs Again and Again"

**Background:** `--color-bg-alt`.

- Section title (`--text-h2`): exact text above, verbatim.
- Content: embedded video, YouTube ID `STouQwJZ4bY`. Use a standard responsive 16:9 embed container.
- Styling: thin `--color-accent` border/frame around the player (1–2px), no other decoration.

---

## 4. "How Partners Review Us"

**Background:** `--color-bg`.

- Section title (`--text-h2`): exact text above, verbatim.
- **Layout: horizontally-scrolling filmstrip**, not a grid. Cards per `design.md` §5 (flat, 1px `--color-border`, no shadow, background matches this section's `--color-bg`).
- 9 cards, each containing one review screenshot at its native aspect ratio, no cropping. Order and alt text below (preserve alt text for accessibility/SEO — do not shorten):

  1. `Client review: Funnel Optimization Assessment and Recommendations`
  2. `Client review: E-commerce analytics, CRO, and A/B testing`
  3. `Client review: Marketing and conversion rate optimization consultation`
  4. `Client review: Conversion Rate Optimization Expert quick job`
  5. `Client review: PostHog and Analytics Expert`
  6. `Client review: Conversion Rate Optimization for Coaching Business`
  7. `Client review: Conversion Rate Optimization and PostHog`
  8. `Client review: Course Marketing Funnel Manager`
  9. `Client review: SaaS Google Analytics and PostHog setup`

- Enable momentum/snap scroll on touch devices; on desktop, either free scroll or paged arrows — implementer's choice, no brand constraint here.
- Source images: not in the brand assets repo — see `ASSET_MANIFEST.md` §3 for original URLs to re-host.

---

## 5. About Us

**Background:** `--color-bg-alt`.

- Section title: **"About Us"** (`--text-h2`).
- **Layout:** two-column founder cards side by side (desktop), stacked (mobile). Divider between them: 1px `--color-border`, vertical on desktop / horizontal on mobile.
- **Photos: small and identity-scale, not hero-scale.** Cap per `design.md` §5 — 96px mobile / 128px desktop, circular crop. The previous pass ran these too large for a compact layout; keep them proportionate to the name/role text next to them, not a dominant visual element.

**Card 1**
- Photo: Iman Nazari headshot (see `ASSET_MANIFEST.md`)
- Name (`--text-h3`): Iman Nazari
- Role (`--text-label`, `--color-text-muted`): Co-Founder — Strategy & Experimentation
- Bio (`--text-body`), verbatim:
  > Iman connects what most teams keep separate: technology, business, and human behavior. He is the strategic force behind 99Ways' approach to conversion; translating user psychology, product reality, and commercial goals into decisions that actually improve performance. Where others guess at what customers want, Iman looks for signal: how people think, what drives action, and which changes measurably move results. He is relentless about clean measurement, sound inference, and experiments you can trust. For him, better decisions start with better evidence. Every metric must be credible, every insight must survive scrutiny, every test must produce learning; not noise. That is the foundation of 99Ways: reliable data, sharper understanding, and changes proven before they are scaled.

**Card 2**
- Photo: Moein Heshmati headshot (see `ASSET_MANIFEST.md`)
- Name (`--text-h3`): Moein Heshmati
- Role (`--text-label`, `--color-text-muted`): Co-Founder — Data Systems & Engineering
- Bio (`--text-body`), verbatim:
  > Moein turns complexity into order. He's the architect behind 99Ways' tracking, reporting, and deployment systems; ensuring every insight is built on verified data and reproducible results. Where others chase creative flair, Moein builds structure: repeatable processes, documented workflows, and flawless implementation. He treats precision as a form of respect, for data, for the client, and for the truth. Nothing escapes his attention. Every number must reconcile, every change must be traceable, every system must work exactly as intended. That discipline is what allows 99Ways to move fast without breaking things.

---

## 6. "Latest from 99Ways Academy"

**Background:** `--color-bg`.

**Implementation:** an Astro Content Collection — one Markdown/MDX file per post, with frontmatter for title, category, excerpt, slug, and a date field. Query with `getCollection()`, sort by date descending, take the latest 3. This is the reason a content collection was already the plan in the earlier draft of this spec — it maps directly onto Astro's own content model, no adaptation needed there.

**Implementation requirement:** the 3 real posts below must be what's actually rendering — verify no scaffold or placeholder content is present before marking this section done.

- Section title (`--text-h2`): exact text above, verbatim.
- **Layout:** 3-column card grid (desktop), 1-column stacked (mobile). Show the latest 3 posts (not all 6) — **confirmed, consistent with the compact-layout direction elsewhere in this spec.**
- Card structure per post: category tag (`--text-label`, `--color-accent`) → title (`--text-h3`, links to post) → excerpt (`--text-body`, `--color-text-muted`, clamped to ~3 lines).
- Posts, in order, verbatim:

  1. **Story of 74% CVR lift in 6 months for a health brand** → `/health-brand-case-study/` · Category: Uncategorized
     > I owned CRO and experimentation for a high-volume consumer-health funnel, which included from research and measurement through test design, implementation,…
  2. **Why Experimentation Is a Must-Have for Your Business** → `/why-experimentation-is-important-for-business/` · Category: Guides and How-tos
     > Business experimentation is more than choosing a winning page. It reveals which customer problems deserve investment, which ideas should stop, and where to commit resources with evidence.
  3. **Confidence vs PostHog: Which Experimentation Platform Fits Your Team?** → `/confidence-vs-posthog/` · Category: Tools Comparison
     > An evidence-based Confidence vs PostHog comparison covering data architecture, statistical methods, guardrails, governance, pricing, tradeoffs, and a practical evaluation plan.
  4. **PostHog Implementation for Growth Lever Teams** → `/posthog-implementation/` · Category: PostHog Feature Breakdowns
     > A useful PostHog implementation is not an SDK installation or feature tour. It is a decision system connecting business-aware events, identity, acquisition, revenue, experiments, and QA so a growth team can identify a lever, act on it, and validate the result.
  5. **A/B Testing Metrics: Choose the Primary Metric Closest to Profit** → `/ab-testing-metrics/` · Category: Guides and How-tos
     > The best A/B testing metric is usually the measurable outcome closest to incremental contribution per eligible visitor, user, or account. This guide separates true decision metrics, operational primaries, leading indicators, guardrails, and diagnostics—then maps ecommerce, subscription, pricing, lead-generation, marketplace, and cost-changing experiments to the metrics that should actually determine the winner.
  6. **CRO Redesign vs Ongoing A/B Testing: Which to Start With?** → `/cro-redesign-vs-ab-testing/` · Category: Guides and How-tos
     > A tested one-time redesign can be rational when the current experience needs a structural reset. Ongoing A/B testing creates more long-term value when each experiment produces both deployed impact and reusable customer learning. This framework shows how to choose—and why one hypothesis does not mean changing only one UI element.

- Footer link: **"View all posts"** → `/academy/`

---

## 7. Pre-footer CTA

**Background:** `--color-bg-alt`.

**Status: required, not optional.** This is currently missing from the live build — the page goes straight from the Academy grid to the footer. Building this section is a required deliverable of the next pass. Not present on the original WordPress site — added as a second conversion point before the footer, on a page this content-light. **Reuses existing CTA copy only, no new text.**

- **Placement:** immediately after the Academy blog grid (§6), immediately before the footer (§8).
- **Layout:** full-width band, single centered column — no side-by-side content, this is a CTA moment, not a content section.
  - Optional short label above the button (`--text-label`, `--color-text-muted`), e.g. reuse of the hero subhead's tone — **do not write new copy for this; if a label is wanted, it must reuse existing site copy verbatim, otherwise omit it and go straight to the button.**
  - Button: **"Book Intro Call"** — same link target as the hero CTA (`[TODO: same deferred placeholder as §2 — no booking tool set up yet]`).
- **Styling:** primary button style per `design.md` §5 (`--color-action` fill, `--text-label`/Plex Mono label, compact `10px 24px` padding). Section vertical padding: `--space-8` mobile → `--space-16` desktop (compact, matches the rest of the page — not an oversized "hero moment").

---

## 8. Footer

**Background:** `--color-bg`.

- Compact mark only (not full wordmark): `logo/compact/dark/99ways-compact-dark-background.svg`, min 64px.
- **Three link columns**, verbatim:

  **Resources**
  - Guides and How-tos → `/category/guides-how-to/`
  - PostHog Feature Breakdowns → `/category/posthog-feature-breakdown/`
  - Tools Comparison → `/category/tools-comparison/`
  - Optimization Experiences → `/category/optimization-experience/`
  - Featured Experiments → `/category/optimization-experience/featured-experiments/`

  **Services**
  - PostHog & Product Analytics → `/hire-posthog-expert-guide/`
  - Hyros & Tracking Setup → `/hire-hyros-expert-guide/`
  - CRO → `/hire-cro-expert/`

  **About Us**
  - Contact Us → `/contact-form/`
  - Iman's Upwork → `https://www.upwork.com/freelancers/imannazari`
  - Agency's Upwork → `https://www.upwork.com/agencies/1718792436665155584/`
  - Fiverr → `https://www.fiverr.com/ishto7`
  - GitHub → `https://github.com/99ways-io`
  - LinkedIn → `https://www.linkedin.com/company/99ways-io/`
  - Medium → `https://medium.com/nes-stories`
  - Google Maps → `https://maps.app.goo.gl/daoBjTCZu7YghnJj9`

- **Map embed: removed.** Do not implement or render a Google Maps component in this pass — this reverses the earlier plan to embed a styled/static map. The plain "Google Maps" text link above (to the external maps.app.goo.gl URL) stays; only the embedded widget is cut. Add the embed back only if explicitly requested again later.
- **Social icons row** (`--color-text-muted`, hover `--color-accent`): LinkedIn, Iman's Upwork, Agency's Upwork, Fiverr, GitHub, Medium — same links as above.
- **Legal text** (`--text-small`, `--color-text-muted`), verbatim:
  > *Ninety Nine Ways* is a registered trademark of Nazari Ecom Solutions. Nazari Ecom Solutions is registered with the Dutch Chamber of Commerce (KvK) under registration number 91552451. Office: Mr. Treublaan 7, 1097 DP Amsterdam, The Netherlands. VAT Identification Number: NL004899587B87.
- **Copyright line:** "2025 99Ways | All right reserved." — Privacy Policy (`/privacy-policy/`) | Terms of Service (`/terms-of-use/`)

---

## 9. Explicitly out of scope for this pass

- Cookie consent banner and the email-gate/subscription modal seen on the live site are article/content-gating mechanics, not homepage structure — do not rebuild them as part of this spec. Handle separately if/when article templates are redesigned.
- Pupil hover/motion animation on the logo (documented as future work in `logo-specification.md`, not part of v1.0).
- Light theme / theme toggle.
- Google Maps embed (footer) — removed per updated direction (§8). Only revisit if explicitly requested.
