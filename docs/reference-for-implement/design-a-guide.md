# Design A — "Partner Review Wall" — Source of Truth (v2, masonry)

## What changed from v1

- **Layout mechanism replaced.** Your 9 real image ratios all share one width
  (385.75px) and differ only in height — that's not a "mixed grid-span mosaic," it's a
  classic **3-column masonry**, so the layout now uses CSS multi-column instead of a
  spanning grid. This is simpler and matches the source data exactly instead of forcing
  images into 4 arbitrary size buckets.
- **Hover animation and caption overlay removed.** Tiles are now static images, no
  grayscale filter, no color-reveal, no name/role text on hover, no invisible link
  overlay. The section is just the header + the image wall.

## 1. Layout mechanics

```css
.review-grid {
  column-count: 3;
  column-gap: 14px;
}
.review-tile {
  break-inside: avoid;   /* stops a tile splitting across two columns */
  margin-bottom: 14px;
}
.review-tile img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
```

- `column-count: 3` + `column-gap` creates the 3 equal-width columns. The browser
  fills column 1 top-to-bottom, then column 2, then column 3, and — because
  `column-fill` defaults to `balance` for on-screen (non-paged) content — it also tries
  to even out the *total height* of the three columns automatically. You don't need to
  hand-place items; just list all 9 in the DOM in one flat order.
- Each tile carries a fixed `aspect-ratio` matching its real image (see §2) so the
  height is correct **before** the image finishes loading — this prevents layout shift,
  which matters more here than in a normal grid because multi-column reflow is more
  visible if heights jump after load.
- `object-fit: cover` is a safety net in case a delivered image doesn't exactly match
  its declared ratio (e.g. someone swaps in a slightly different screenshot later).

## 2. The 9 real ratios → CSS classes

| Class | Width | Height | Ratio (w/h) |
|---|---|---|---|
| `.r-1` | 385.75 | 100.60 | 3.835 |
| `.r-2` | 385.75 | 128.33 | 3.006 |
| `.r-3` | 385.75 | 140.83 | 2.739 |
| `.r-4` | 385.75 | 114.08 | 3.382 |
| `.r-5` | 385.75 | 136.88 | 2.818 |
| `.r-6` | 385.75 | 259.95 | 1.484 |
| `.r-7` | 385.75 | 162.86 | 2.368 |
| `.r-8` | 385.75 | 113.81 | 3.389 |
| `.r-9` | 385.75 | 358.08 | 1.077 |

Each class sets `aspect-ratio: <your-width> / <your-height>;` using your exact numbers
— not a rounded ratio — so implementation and design stay pixel-faithful regardless of
the column's rendered width at any breakpoint.

**Agent instructions for the 9 real images:** map each image file to the `.r-*` class
matching its native aspect ratio (not by "which looks best where" — the ratios were
measured from your actual assets, so the mapping is fixed, not a design choice). If a
10th image or a replacement image is ever added with a new ratio, add one more `.r-*`
class rather than reusing an existing one — reusing a slightly-off ratio class will crop
the image via `object-fit: cover` in a way that wasn't tested.

## 3. Responsive behavior (mobile/tablet — my call, as requested)

```css
@media (max-width: 900px) { .review-grid { column-count: 2; } }
@media (max-width: 560px) { .review-grid { column-count: 1; } }
```

Rationale: the aspect ratios themselves don't change across breakpoints — these are
real screenshots, so re-cropping them per breakpoint would mean shipping multiple crops
per image, which is unnecessary complexity for a review wall. Instead, only the **column
count** changes:
- **Desktop (≥900px):** 3 columns, as specified.
- **Tablet (560–899px):** 2 columns — most of your ratios are landscape (ratio > 2.3),
  so 2 wider columns still read cleanly.
- **Mobile (<560px):** 1 column, full-width stack — at this width, 2+ columns would
  make the wide screenshots (ratio 3+) too small to read any text baked into them.

If any review image contains small text that becomes illegible at mobile column widths,
flag that back rather than shrinking the column further — the fix is a higher-res source
image, not a 4th breakpoint.

## 4. Copy strategy (unchanged)

Header stays to two lines: eyebrow (optional social-proof number) + headline. No
per-image captions, no CTA — confirmed by this iteration's request to drop all
interaction text.

## 5. Astro porting — step by step

### 5.1 File structure

```
src/
  components/
    PartnerReviews.astro
  assets/
    reviews/
      review-01.jpg ... review-09.jpg   (src/assets, for astro:assets optimization)
```

### 5.2 Data + markup

```astro
---
import { Image } from 'astro:assets';
import review01 from '../assets/reviews/review-01.jpg';
// ...import review02–09 the same way

interface Review {
  image: ImageMetadata;
  alt: string;
  ratioClass: string;   // one of r-1 ... r-9, mapped per §2
}

const reviews: Review[] = [
  { image: review01, alt: 'Partner review, Wren Logistics', ratioClass: 'r-1' },
  { image: review02, alt: 'Partner review, Kettlewell Studio', ratioClass: 'r-2' },
  // ...remaining 7, mapped to their actual measured ratio, not by position
];
---

<section class="review-section">
  <header class="review-header">
    <p class="eyebrow">Trusted by 40+ partner teams</p>
    <h2>How our partners<br />review us</h2>
  </header>

  <div class="review-grid">
    {reviews.map((r) => (
      <article class:list={["review-tile", r.ratioClass]}>
        <Image src={r.image} alt={r.alt} loading="lazy" />
      </article>
    ))}
  </div>
</section>

<style>
  /* Port .review-grid / .review-tile / .r-1 ... .r-9 from design-a.html
     verbatim — plain CSS, no Tailwind-specific syntax was used here. */
</style>
```

- Use `astro:assets`' `<Image />` rather than raw `<img>` so the 9 screenshots get
  automatic `webp`/responsive output — worth it since screenshots are often large PNGs.
- `class:list` combines the static `review-tile` class with the per-image ratio class.

### 5.3 What to flag back to the user, not silently change

- If a real image's measured ratio doesn't match any of the 9 provided values closely,
  don't force it into the nearest class — ask whether it's a genuinely new ratio (add a
  `.r-10`) or a measurement error worth re-checking.
- `column-count` masonry (this approach) fills column-by-column with browser-side
  balancing, not left-to-right row order. If a future requirement needs precise manual
  control over which image sits in which column (e.g. "review 6 must be top of column
  2"), that requires switching to a JS masonry approach or CSS Grid with manually
  computed row-spans — flag this rather than quietly reordering the DOM to hack the
  balance algorithm.
