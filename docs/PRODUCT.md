# PRODUCT.md — Vision, Goals & Roadmap

## 1. What 99ways.io is

99ways.io is the marketing site for a CRO (conversion rate optimization) agency/consultancy run by two co-founders, Iman Nazari (Strategy & Experimentation) and Moein Heshmati (Data Systems & Engineering). The business offers three core services — Conversion Rate Optimization, PostHog & Product Analytics setup, and Hyros & Tracking Setup — and publishes an educational content hub ("99Ways Academy") covering CRO methodology, analytics tooling, and A/B testing practice.

The homepage's job: establish credibility (client testimonials, founder bios, a demo video), explain what the service is (hero + service nav), and drive one action — booking an intro call.

## 2. This project: WordPress → Astro migration + redesign

The site is being rebuilt from scratch on Astro (previously WordPress; briefly evaluated and abandoned EmDash CMS mid-project — see `OPERATIONS.md` §5 for that history). Alongside the framework migration, the brand went through a full visual redesign: new logo, new dark-only color palette, new typography (Fraunces + IBM Plex Sans/Mono), and a more compact, minimal layout language than the original WordPress site had.

**Content preservation is a strict, standing rule for this whole project:** existing homepage copy (headline, section titles, bios, excerpts, legal text) is being *restructured and restyled*, never rewritten or invented. Every piece of copy in `ARCHITECTURE.md` §5 is verbatim from the live WordPress site. This rule doesn't relax as the project continues — a later phase adding a new section (e.g. the pre-footer CTA) still only reuses existing copy, it doesn't introduce new marketing language.

## 3. Target experience

- **Dark, minimal, precise** — not corporate-generic, not decorative. Flat components, hairline borders, restrained color use (green reserved specifically for the one primary action).
- **Mobile-first** — the majority of intended traffic is assumed mobile; desktop is a progressive enhancement, not the design's starting point.
- **One clear action**: "Book Intro Call." It appears twice (hero, pre-footer) and is the only element on the page using the action-green color.
- **Fast-loading, static** — no CMS runtime, no database; content ships as part of the build.

## 4. Open items & roadmap

Status as of the latest design pass:

- **Resolved:** hero visual. Originally deferred (ship text-only, revisit later); superseded by the **Decorative Logo Field** — a static, faint, scattered-logo-mark background texture behind the hero's centered text column. Full spec in `ARCHITECTURE.md` §4.
- **Resolved:** testimonials image wall. The "How Partners Review Us" section previously used a 3D carousel with auto-rotation, peek/scale states, and a lightbox — this broke on mobile with horizontal page scroll at 375px–414px viewports. Replaced with a CSS multi-column masonry wall (`TestimonialsMasonry.astro`) with dashed `--color-accent` borders on all images. Scoped interactivity (hover animation + click-to-lightbox) was reintroduced on September 20 2026, active only at ≥560px viewport width (tablet/desktop); below 560px the section remains static and non-interactive by design, distinct from the removed carousel. Full spec updated in `ARCHITECTURE.md` §4. Section-level properties (background, title, fonts, spacing) unchanged.
- **Resolved:** Pre-Footer CTA visual. The section was initially text+button only (placeholder destination URL). Added **Pointer Field** — a decorative layer of small blue pointer glyphs behind the CTA button, each aimed at the button's measured pixel center. Component: `PointerField.astro` (client:idle island, seeded PRNG for deterministic placement). Full spec in `ARCHITECTURE.md` §4.
- **Open:** "Book Intro Call" destination URL. No booking tool is set up yet; the button ships as an intentional non-functional placeholder in both its locations (hero, pre-footer). Wire this up once a booking tool exists — this is the one piece of the homepage still waiting on a decision outside the codebase.
- **Not yet built:** anything beyond the homepage. The nav already links to service pages (`/hire-cro-expert/`, etc.), category archive pages, individual Academy posts, and legal pages — none of these subpages are in scope yet. When site expansion beyond the homepage starts, the design system in `ARCHITECTURE.md` §3–4 is the standard to extend from, not a homepage-only ruleset — component definitions, tokens, and the mobile-first approach should scale to subpages without redefinition.
- **Explicitly out of scope for the current pass** (don't build these without a new explicit instruction):
  - Cookie consent banner and the email-gate/subscription modal seen on the old WordPress article pages — these are article/content-gating mechanics, not homepage structure. Revisit if/when article templates get redesigned.
  - Light theme / theme toggle — dark-only for the foreseeable future.
  - Google Maps embed in the footer — removed by deliberate decision. The plain external "Google Maps" text link stays; only the embedded widget was cut. Only revisit if explicitly requested again.
  - Any motion/animation on the Decorative Logo Field — it's a static component by design, see `ARCHITECTURE.md` §4.
- **Content collection growth:** the Academy content model (Astro Content Collections, one Markdown/MDX file per post) currently holds 6 posts total, 3 of which surface on the homepage (latest-by-date). This is built to extend — adding a 7th post and beyond requires no homepage code changes, just a new content entry.
