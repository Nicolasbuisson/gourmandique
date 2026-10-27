# Gourmandique — Page Structure

The section-by-section blueprint for every page. [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
says what things **look like**; this file says what things **are** and in what
order they appear.

Use it as the checklist when building a page: one `<section>` per row, in the
order listed, nothing extra.

---

## Route map

| Page    | Route               | File                            | Status                             |
| ------- | ------------------- | ------------------------------- | ---------------------------------- |
| Home    | `/`                 | `app/page.tsx`                  | Exists — template content, replace |
| Shop    | `/shop`             | `app/shop/page.tsx`             | Rename of `app/search/` — see below |
| Shop    | `/shop/[collection]` | `app/shop/[collection]/page.tsx` | Rename of `app/search/[collection]/` |
| Wedding | `/wedding`          | `app/wedding/page.tsx`          | To build                           |
| About   | `/about`            | `app/about/page.tsx`            | To build                           |
| Contact | `/contact`          | `app/contact/page.tsx`          | To build                           |
| Product | `/product/[handle]` | `app/product/[handle]/page.tsx` | Exists — template                  |

**`app/[page]/page.tsx` is a Shopify-CMS catch-all.** Static segments win over
dynamic ones in Next.js routing, so creating `app/about/` shadows any Shopify
page with the handle `about`. That is intended — just don't expect a Shopify
page named `wedding` or `contact` to render once these folders exist.

### `/search` → `/shop`

`/shop` **is** the template's search route, renamed. There is no separate search
page: the navbar search box lands on `/shop?q=…`, and the products section
renders query results when `q` is present and the full catalogue when it isn't.
That keeps one browse surface with one filter and sort UI.

Move `app/search/` → `app/shop/` (`page.tsx`, `layout.tsx`, `loading.tsx`,
`children-wrapper.tsx`, `[collection]/page.tsx`,
`[collection]/opengraph-image.tsx`), then fix the five places that hardcode the
old path:

- [navbar/search.tsx:12](components/layout/navbar/search.tsx#L12) — the form
  `action="/search"`
- [lib/shopify/index.ts:152](lib/shopify/index.ts#L152) — collection `path` in
  `reshapeCollection`
- [lib/shopify/index.ts:366](lib/shopify/index.ts#L366) and
  [:386](lib/shopify/index.ts#L386) — the synthetic "All" collection, in both
  the unconfigured and configured branches
- [lib/shopify/index.ts:423](lib/shopify/index.ts#L423) — `getMenu`'s
  `.replace("/collections", "/search")`, which rewrites Shopify menu URLs

The sidebar links, the "All" entry and the Shopify header menu all break
silently if any one of these is missed — they produce valid-looking links to a
404. Grep for `/search` after the move; it should return nothing outside
`components/layout/search/` (a directory name, not a route — leave it, or rename
it to `components/layout/shop/` in the same pass).

Add a permanent redirect in `next.config.ts` from `/search` to `/shop`
(preserving `q`) if any links have gone out already; skip it if not.

---

## Page shell

Shared chrome that no page declares for itself:

- **Navbar** — [navbar/index.tsx](components/layout/navbar/index.tsx), rendered
  once in [layout.tsx](app/layout.tsx). Pulls the Shopify menu
  `next-js-frontend-header-menu`; the five links above must exist there.
- **Footer** — ends every page in this document. It is currently imported
  per-page in four places ([page.tsx](app/page.tsx),
  [search/layout.tsx](app/search/layout.tsx),
  [\[page\]/layout.tsx](app/[page]/layout.tsx), the product page). Since the
  answer is now "every page, always", hoist it into the root layout and drop the
  four imports. Footer is therefore **not** repeated in the per-page tables
  below — assume it.

**The hero is page-local.** Every page opens with one, but no two are alike —
different layout, media, height and intent — so each page owns its own hero
component (`components/home/hero.tsx`, `components/wedding/hero.tsx`, …) or
writes it inline in the page file. Don't try to unify them behind props; a hero
with four layout variants is harder to read than four heroes. What they share is
only the conventions below: one `<h1>` in `font-display text-h1`, an `id="hero"`,
and the standard container.

### Section anatomy

Every section follows the same contract so pages stay composable:

```tsx
<section id="gallery" aria-labelledby="gallery-title" className="py-20 md:py-28">
  <div className="mx-auto w-full max-w-7xl px-6">
    <p className="text-eyebrow text-ink-subtle">Our work</p>
    <h2 id="gallery-title" className="font-display text-h2 text-ink">…</h2>
  </div>
</section>
```

- **Container:** `mx-auto w-full max-w-7xl px-6`. The codebase currently mixes
  `max-w-7xl` and `max-w-(--breakpoint-2xl)`; standardise on `max-w-7xl` as
  pages are rebuilt.
- **Rhythm:** `py-20 md:py-28` for a full section, `py-14 md:py-20` for a
  compact one. Never set vertical margins on a section — spacing belongs to the
  section itself so sections can be reordered freely.
- **`id`** on every section, named as in these tables, so in-page CTAs
  (`/wedding#booking`) work.
- **Alternating ground:** `bg-surface` by default, `bg-surface-sunken` to break
  up a long stack. Two sunken sections never touch.

---

## Shared section components

Five of the sections below repeat across pages. Build each **once** in
`components/sections/`, driven by props, with page-specific copy passed in — not
copy-pasted per page. (Heroes are the exception — see above.)

| Component      | File                                   | Used on                     | Shape                                    |
| -------------- | -------------------------------------- | --------------------------- | ---------------------------------------- |
| `Gallery`      | `components/sections/gallery.tsx`      | Home, Wedding               | `items[]`, `columns`, `cta`              |
| `Testimonials` | `components/sections/testimonials.tsx` | Home, Wedding               | `items[]` of `{ quote, name, occasion }` |
| `Faq`          | `components/sections/faq.tsx`          | Home, Wedding               | `items[]` of `{ q, a }`                  |
| `Stats`        | `components/sections/stats.tsx`        | Home, About                 | `items[]` of `{ value, label }`          |
| `CtaBanner`    | `components/sections/cta-banner.tsx`   | About (+ reusable anywhere) | `title`, `body`, `primary`, `secondary`  |

`Faq` should render as real `<details>`/`<summary>` elements — open by default
is fine, and it needs no client JavaScript. Emit FAQPage JSON-LD from the same
`items[]` array so the copy and the structured data cannot drift.

**Content lives in `lib/content/`** as typed modules (`faq.ts`,
`testimonials.ts`, `stats.ts`, `gallery.ts`) — not inline in JSX. Copy changes
then touch one file, and the Wedding FAQ can share the type while keeping its
own list.

---

## Home — `/`

The one page that has to work for a visitor who has never heard of the bakery.
Order is deliberate: what we make → proof it's good → answer the objection.

| #   | Section          | `id`             | Purpose                                                       | Content / data                                                                              |
| --- | ---------------- | ---------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | Hero             | `hero`           | Say what Gourmandique is in one glance; primary CTA to Shop   | **Page-local.** The tallest hero on the site: full-bleed signature-cake image, `font-display text-h1`, primary CTA → `/shop`, secondary → `/wedding`. Static. |
| 2   | Features         | `features`       | Name the two main offerings so visitors self-select           | 2–3 cards: **Cakes & pastries** → `/shop`, **Wedding cakes** → `/wedding`, optional **Custom orders** → `/contact`. Image + title + one line + link each. Static. |
| 3   | Gallery          | `gallery`        | Show the product range; carry the craft                       | 6–9 product images, masonry or 3-col grid. Shopify products (reuse `getProducts`) or curated static set. "See everything" → `/shop`. |
| 4   | Stats            | `stats`          | Social proof in numbers before the words                      | 3–4 figures: cakes baked, weddings served, years baking, 5-star reviews. Static, `lib/content/stats.ts`. |
| 5   | Testimonials     | `testimonials`   | Proof from customers                                          | 3 quotes, mixed occasions. Static.                                                           |
| 6   | FAQ              | `faq`            | Clear the blockers: lead time, delivery, allergens, custom    | 5–7 Q&A, general-purpose.                                                                    |

Replace the current `ThreeItemGrid` + `Carousel` body of
[page.tsx](app/page.tsx). Both are template components; `ThreeItemGrid` can be
retired or recast as the Gallery.

Metadata in that file still carries the Vercel Commerce description — rewrite it
with the real title and description.

---

## Shop — `/shop`

A browse page, not a landing page. The hero stays short; products start above
the fold on desktop.

| #   | Section       | `id`       | Purpose                                 | Content / data                                                                                                 |
| --- | ------------- | ---------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | Hero          | `hero`     | Orient, then get out of the way         | **Page-local**, and the shortest on the site. Title + one line, no image or a thin banner. Static. Lives in `app/shop/layout.tsx` so it also sits above `/shop/[collection]`. |
| 2   | Products list | `products` | Browse, filter, sort, add to cart       | Shopify Storefront via `getProducts` / `getCollectionProducts`. Reuse `Collections` (sidebar), `FilterList` (sort), `Grid` + `ProductGridItems`. |

Products section notes:

- Collection filtering and sort already work via search params — keep that
  contract so links like `/shop?sort=price-asc` stay shareable.
- Needs an **empty state** (no products in a collection) and a **loading state**
  (reuse the pattern in [search/loading.tsx](app/search/loading.tsx)).
- On mobile the collection sidebar collapses above the grid — that behaviour is
  in the existing search layout; don't rebuild it.

---

## Wedding — `/wedding`

A single-goal page: get a consultation booked. Every section points at
`#booking`.

| #   | Section          | `id`           | Purpose                                            | Content / data                                                                                      |
| --- | ---------------- | -------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | Hero             | `hero`         | Set the tone; CTA jumps to the form                | **Page-local.** The most editorial hero — wedding-cake image, generous whitespace, single primary CTA → `#booking`. Static. |
| 2   | Gallery          | `gallery`      | The actual portfolio — the strongest asset here    | 9–12 past wedding cakes, larger tiles than Home. Captions welcome (venue, season). Static set in `lib/content/gallery.ts`. |
| 3   | Testimonials     | `testimonials` | Wedding-specific quotes only                       | 3–4 quotes from couples, with wedding date or venue. Separate list from Home's.                      |
| 4   | FAQ              | `faq`          | Wedding-specific blockers                          | Lead time, tastings, servings per tier, delivery & setup, deposit, dietary. Different list from Home's — same component. |
| 5   | Booking          | `booking`      | Capture the enquiry with a date                    | Form + date/calendar picker. **This is the conversion point** — the CTA anchor target.                |

Booking section notes:

- Fields: name, email, phone, wedding date, venue / city, guest count, flavours
  or style notes, how they found us.
- **No calendar dependency is installed.** Two routes: embed a scheduler
  (Cal.com / Calendly) for the fastest working version, or build a native form
  with a `<input type="date">` and a server action that emails or stores the
  enquiry. Pick one before starting this section — it decides whether the page
  needs a client component at all.
- Either way: validate on the server, show a success state in place of the form
  (don't navigate away), and set a sensible minimum date (no bookings inside the
  lead time stated in the FAQ).
- An unavailable-date calendar needs a source of truth for availability.
  Scope that explicitly or ship a plain date field first.

---

## About — `/about`

Meriem is the product differentiator. This page is a story, then a nudge.

| #   | Section   | `id`        | Purpose                                             | Content / data                                                                                              |
| --- | --------- | ----------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1   | Hero      | `hero`      | Meriem and her passion for baking                   | **Page-local**, and structurally unlike the others: a two-column portrait-beside-prose layout carrying a few paragraphs in her voice, not a headline over an image. Static. |
| 2   | Stats     | `stats`     | Ground the story in numbers                         | Same component as Home; may reuse the same figures.                                                          |
| 3   | Instagram | `instagram` | Show it's a living bakery; push to follow            | 6–8 recent-looking posts in a grid, each linking to Instagram, plus a follow CTA with the handle.            |
| 4   | CTA       | `cta`       | Convert the reader who now likes her                | `CtaBanner` on `bg-accent` with `text-on-accent`. Primary → `/shop`, secondary → `/wedding`.                 |

Instagram section notes: Instagram's Basic Display API is retired, so a live
feed means the Graph API with a business account and a long-lived token, or a
third-party widget. For now build it as a **static curated grid** of images in
`lib/content/instagram.ts` with outbound links — same markup, no API, and
swappable for a real feed later without touching the page.

---

## Contact — `/contact`

Deliberately minimal. No hero, no upsell.

| #   | Section | `id`      | Purpose                                | Content / data                                                                                                     |
| --- | ------- | --------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | Contact | `contact` | One place to reach the bakery          | Two columns: the form, and the details beside it — email, phone, address, hours, social links, optional map embed. |

Notes:

- Form fields: name, email, subject or enquiry type, message. Enquiry type
  should include "Wedding", linking out to `/wedding#booking` when selected —
  weddings belong in the booking form, not here.
- Same server-side validation and in-place success state as the booking form.
  If both pages post an enquiry, share one server action and one email template.
- Give the section top padding (`pt-14 md:pt-20`) so it doesn't collide with the
  navbar in the absence of a hero.

---

## Before building

Two decisions are still open and each one changes the work:

1. **Booking calendar** — third-party embed or native form? Decides the client
   JavaScript, the data store, and what availability means.
2. **Instagram** — curated static grid or live Graph API feed?

Per-page checklist as each one is built:

- `export const metadata` with a real title and description (the template's
  Vercel copy is still in `app/page.tsx`, and `app/search/page.tsx` is titled
  "Search" — rename it with the route).
- Sections in the order above, each with its `id`.
- Tokens from [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) only — semantic names
  (`bg-surface`, `text-ink`, `text-on-accent`), no `dark:` variants, no raw hex.
- Headings go `font-display` + `text-h*`; one `<h1>` per page, in the hero.
- `next/image` with explicit `sizes` for every gallery and product image.
