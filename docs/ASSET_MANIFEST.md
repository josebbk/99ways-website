# 99Ways — Asset Path Reference

Paths below are relative to the `assets/` directory in the new Astro project repo (this folder was migrated wholesale from the original brand assets repo — same internal structure, now living inside the site's own repo rather than a separate one). Verify these resolve — if the actual mount point differs from `assets/`, adjust the prefix only, not the paths themselves.

---

## 1. Assets confirmed available (pulled per your note)

| Use | Path | Notes |
|---|---|---|
| Header/footer wordmark (dark theme) | `assets/logo/wordmark/dark/99ways-wordmark-dark-background.svg` | 455.7135 × 129.6533 viewBox. Min render width 180px. |
| Compact mark (dark theme) | `assets/logo/compact/dark/99ways-compact-dark-background.svg` | 146 × 101 viewBox. Min render width 64px. |
| Favicon | `assets/icons/favicon/99ways-favicon.svg` | Has built-in light/dark `prefers-color-scheme` variants — use directly, don't fork per-theme. |
| Apple touch icon | `assets/icons/apple-touch/99ways-apple-touch-icon-180.png` | 180×180, opaque Warm White field — use as-is for `<link rel="apple-touch-icon">`. |

## 2. Available in the repo but not currently used in this spec

Listed for completeness — pull if a later section needs them (e.g. social sharing, dark-mode edge cases):

- `raster/wordmark/` and `raster/compact/` — PNG fallbacks (1024w/2048w, 512/1024 square) if SVG isn't viable in some render context.
- `social/avatar/99ways-avatar-warm-white-1024.png` — square profile avatar, not a homepage element.
- `icons/micro/*` — 16/24/32/48px optical derivatives, for favicon-scale contexts smaller than the compact mark's 64px floor.
- `masters/` — editable source SVGs. **Do not ship these to production** — they're for design edits only.

## 3. Assets NOT in the brand repo — need sourcing before build

These are content images from the current live WordPress site's media library, not part of the brand assets package. The CLI agent won't find them in `assets/`. There's no CMS import path in an Astro-only stack — re-download each from the URLs below and place them under `src/assets/` (so they go through Astro's built-in `astro:assets` image optimization) or `public/` if you need a plain static path instead. Pair each image with its corresponding Astro content-collection entry (see §Academy blog post note below) rather than hardcoding paths inline.

**Testimonial screenshots (Section 4, carousel — 9 images, in display order):**
1. `https://99ways.io/wp-content/uploads/2026/07/Screenshot-2025-10-21-at-11.46.12.webp`
2. `https://99ways.io/wp-content/uploads/2026/07/Screenshot-2025-10-20-at-20.10.05-e1761003445793.webp`
3. `https://99ways.io/wp-content/uploads/2026/07/Screenshot-2025-10-21-at-11.39.31.webp`
4. `https://99ways.io/wp-content/uploads/2026/07/Screenshot-2025-10-21-at-11.40.23.webp`
5. `https://99ways.io/wp-content/uploads/2026/07/Screenshot-2025-10-21-at-11.33.00.webp`
6. `https://99ways.io/wp-content/uploads/2026/07/Screenshot-2025-10-21-at-11.29.51.webp`
7. `https://99ways.io/wp-content/uploads/2026/07/Screenshot-2025-10-21-at-11.37.38.webp`
8. `https://99ways.io/wp-content/uploads/2026/07/Screenshot-2025-10-21-at-11.47.35.webp`
9. `https://99ways.io/wp-content/uploads/2026/07/Screenshot-2025-10-21-at-11.46.37.webp`

**About Us photos (Section 5):**
- Iman Nazari: `https://99ways.io/wp-content/uploads/2026/07/2026-05-26-17.45.07.jpg`
- Moein Heshmati: `https://99ways.io/wp-content/uploads/2026/07/cropped_circle_image-9.webp`

**Academy blog post thumbnails (Section 6):** resolved — pulled directly from each post's og:image:
- "Story of 74% CVR lift..." → `https://99ways.io/wp-content/uploads/2026/09/Gemini_Generated_Image_2x5sm32x5sm32x5s.webp`
- "Why Experimentation Is a Must-Have..." → `https://99ways.io/wp-content/uploads/2026/09/Gemini_Generated_Image_t2bh23t2bh23t2bh.webp`
- "Confidence vs PostHog..." → `https://99ways.io/wp-content/uploads/2026/09/Gemini_Generated_Image_wwkt3twwkt3twwkt.webp`

**Footer social icons (Section 8):** the current build has incorrect icons for Upwork (×2), Fiverr, and Medium — GitHub and LinkedIn are already correct. Real source files, pulled directly from the live site (re-host, don't hotlink):
- LinkedIn (keep as-is, already correct): `https://99ways.io/wp-content/uploads/2025/10/LinkedIn_icon.svg_.webp`
- Iman's Upwork: `https://99ways.io/wp-content/uploads/2026/07/upwork-roundedsquare-1.webp`
- Agency's Upwork (distinct from Iman's — already a different source file on the live site): `https://99ways.io/wp-content/uploads/2026/07/Untitled-design-20-1.webp`
- Fiverr: `https://99ways.io/wp-content/uploads/2026/07/Fiverr_Logo_fiverr.webp`
- GitHub (keep as-is, already correct): `https://99ways.io/wp-content/uploads/2025/11/5968866.png`
- Medium: `https://99ways.io/wp-content/uploads/2026/07/medium-logo-icon.webp`

**Video (Section 3):** YouTube embed, ID `STouQwJZ4bY` — no local asset needed, embed directly.

**Fraunces webfont (site-wide primary font, per `design.md` §2):** on Google Fonts — `https://fonts.google.com/specimen/Fraunces`. No licensing/sourcing step needed; load via `<link>`/`@import` or self-host the variable font file if you want to avoid the Google Fonts runtime request. Resolved — this was Cooper in the earlier pass, swapped for the reasons in `design.md` §2.

## 4. Explicitly removed — do not source

- The frog mascot image (`Gemini_Generated_Image_hd7mpohd7mpohd7m-removebg-preview.webp` and its cropped favicon variant) — dropped per brand decision, do not migrate or re-host it.
- Google Maps embed assets/API key — map component removed per updated direction, no longer needed for this build.

## 5. Open items requiring a human decision before final build

- Hero visual (Section 2) — deliberately deferred, ship text-only this round. Revisit post-launch as a fast-follow if wanted.
- "Book Intro Call" destination URL — deliberately deferred, ship as placeholder this round (used in both the hero and pre-footer CTA). Wire up once a booking tool is set up.
