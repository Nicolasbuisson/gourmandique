# Gourmandique — Page Structure

The section-by-section blueprint for every page. [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
says what things **look like**; this file says what things **are** and in what
order they appear.

Use it as the checklist when building a page: one `<section>` per row, in the
order listed, nothing extra.

The **Inspiration** column on each section links to other sites whose take on
that section is worth studying before building it. Treat it as reference for
feel and motion, not as spec; the Purpose and Content columns still win.

---

## Route map

Every route below is served once per language, under a locale prefix:
`/en/shop`, `/fr/shop` (see [Languages](#languages)). The routes in this table
are written without it, and so is every path elsewhere in this document; the
files all sit under `app/[lang]/`.

| Page    | Route                | File                                    | Status                                      |
| ------- | -------------------- | --------------------------------------- | ------------------------------------------- |
| Home    | `/`                  | `app/[lang]/page.tsx`                   | Exists — template content, replace          |
| Shop    | `/shop`              | `app/[lang]/shop/page.tsx`              | Rename of `app/[lang]/search/` — see below  |
| Shop    | `/shop/[collection]` | `app/[lang]/shop/[collection]/page.tsx` | Rename of `app/[lang]/search/[collection]/` |
| Wedding | `/wedding`           | `app/[lang]/wedding/page.tsx`           | To build                                    |
| About   | `/about`             | `app/[lang]/about/page.tsx`             | To build                                    |
| Contact | `/contact`           | `app/[lang]/contact/page.tsx`           | To build                                    |
| Product | `/product/[handle]`  | `app/[lang]/product/[handle]/page.tsx`  | Exists — template                           |

**`app/[lang]/[page]/page.tsx` is a Shopify-CMS catch-all.** Static segments
win over dynamic ones in Next.js routing, so creating `app/[lang]/about/`
shadows any Shopify page with the handle `about`. That is intended — just don't expect a Shopify
page named `wedding` or `contact` to render once these folders exist.

### `/search` → `/shop`

`/shop` **is** the template's search route, renamed. There is no separate search
page: the navbar search box lands on `/shop?q=…`, and the products section
renders query results when `q` is present and the full catalogue when it isn't.
That keeps one browse surface with one filter and sort UI.

Move `app/[lang]/search/` → `app/[lang]/shop/` (`page.tsx`, `layout.tsx`, `loading.tsx`,
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

These paths stay locale-free: the components that render them add the prefix
(`Collections` runs each collection's `path` through `localizePath`).

The sidebar links, the "All" entry and the Shopify header menu all break
silently if any one of these is missed — they produce valid-looking links to a 404. Grep for `/search` after the move; it should return nothing outside
`components/layout/search/` (a directory name, not a route — leave it, or rename
it to `components/layout/shop/` in the same pass).

Add a permanent redirect in `next.config.ts` from `/search` to `/shop`
(preserving `q`) if any links have gone out already; skip it if not.

---

## Page shell

Shared chrome that no page declares for itself:

- **Navbar** — [navbar/index.tsx](components/layout/navbar/index.tsx), rendered
  once in [layout.tsx](app/[lang]/layout.tsx). Pulls the Shopify menu
  `next-js-frontend-header-menu`; the five links above must exist there.
- **Footer** — [footer.tsx](components/layout/footer.tsx), rendered once in
  [layout.tsx](app/[lang]/layout.tsx), after `<main>`. It ends every page in this
  document, so it is **not** repeated in the per-page tables below — assume
  it. It is a reveal footer: it sticks to the bottom of the window and the page
  scrolls up off it like a curtain. A `clip-path` wrapper does the work, so the
  last section of a page needs no background, `z-index` or margin for it. The
  catch is a set height, `--footer-h` in [globals.css](app/globals.css);
  content added to the footer has to fit it.

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
<section
  id="gallery"
  aria-labelledby="gallery-title"
  className="py-20 md:py-28"
>
  <div className="mx-auto w-full max-w-7xl px-6">
    <p className="text-eyebrow text-ink-subtle">Our work</p>
    <h2 id="gallery-title" className="font-display text-h2 text-ink">
      …
    </h2>
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

## Languages

The site is in English and French, following the Next.js
[internationalization guide](https://nextjs.org/docs/app/guides/internationalization):
a `[lang]` segment at the top of `app/`, a proxy that picks the locale, and one
dictionary per locale.

- **Routes.** Every page sits under [app/[lang]/](app/[lang]/), whose
  [layout.tsx](app/[lang]/layout.tsx) is the root layout. It sets
  `<html lang>`, prerenders `en` and `fr` through `generateStaticParams`, and
  404s any other value. Only the API route and the metadata files (`robots.ts`,
  `sitemap.ts`, the icons) stay outside it. Slugs are not translated:
  `/fr/wedding`, not `/fr/mariage`.
- **Choosing the locale.** [proxy.ts](proxy.ts) (Next's renamed middleware)
  redirects any URL without a prefix, `/` included, to the visitor's last
  locale (the `NEXT_LOCALE` cookie it sets on every prefixed request), then
  to their browser's `Accept-Language`, then to `defaultLocale` (`en`). Paths
  with a file extension, `/api` and `/_next` are left alone.
- **Copy.** [dictionaries/en.json](dictionaries/en.json) and
  [dictionaries/fr.json](dictionaries/fr.json) hold every user-facing string,
  grouped by where it appears (`header`, `nav`, `home.hero`, `home.faq`,
  `shop`, `product`, …). They are the only content files. `en.json` defines
  the type; `fr.json` must match it or the build fails. Pages and layouts call
  `getDictionary(lang)` and pass the strings down; client components get them
  as props too. Copy that breaks onto lines (the CTA title) is an array of
  lines, joined with `<br />` by the page. Placeholders use `{name}` and are
  filled with `format()` from `dictionaries/`.
- **Links.** [lib/i18n.ts](lib/i18n.ts) has `localizePath(lang, "/shop")` for
  every internal link, `switchLocalePath` for the language switcher, and
  `intlLocale` (`en-CA`, `fr-CA`) for `Intl` number and date formatting.
- **Switching.** `LocaleSwitcher` (EN / FR) sits in the header and in the
  footer's bottom row, and links to the same page in the other language.
- **SEO.** The home page declares `alternates.languages` (hreflang), and the
  sitemap lists every route in both locales with its alternates.

Not translated yet:

- **Shopify content** — product titles, descriptions, collections and CMS pages
  come back in the store's default language. Translating them needs the
  Shopify Translate & Adapt app plus `@inContext(language: …)` on the
  Storefront queries in `lib/shopify/`, with the locale passed through from the
  page.
- **Unused template components** — `components/layout/navbar/` and the cart
  modal it opens still carry English strings. They aren't rendered; translate
  them if they come back, or delete them.
- **`WelcomeToast`** — still the template's Vercel promo, in English. Remove it
  rather than translate it.

---

## Shared section components

These five sections repeat across pages, or are built to. Build each **once** in
`components/sections/`, driven by props, with page-specific copy passed in — not
copy-pasted per page. (Heroes are the exception — see above.)

| Component      | File                                   | Used on       | Shape                                                          |
| -------------- | -------------------------------------- | ------------- | -------------------------------------------------------------- |
| `Gallery`      | `components/sections/gallery.tsx`      | Home          | `items[]`, `columns`, `cta`                                    |
| `Testimonials` | `components/sections/testimonials.tsx` | Home, Wedding | `items[]` of `{ quote, name, occasion }`                       |
| `Faq`          | `components/sections/faq.tsx`          | Home, Wedding | `eyebrow`, `title`, `items[]` of `{ q, a }`                    |
| `Stats`        | `components/sections/stats.tsx`        | Home, About   | `eyebrow`, `title`, `items[]` of `{ value, label, suffix? }`   |
| `CtaBanner`    | `components/sections/cta-banner.tsx`   | Home, About   | `children` (title), `body`, `primary`, `secondary`, `images[]` |

`Faq` is a client-side accordion: one answer open at a time (all closed
on load), each opening with the grid-row trick (`grid-template-rows` from `0fr`
to `1fr`), and the "+" turning into a "−" by shrinking its vertical bar's height
to zero. Closed answers are `inert`. It emits FAQPage JSON-LD from the same
`items[]` array so the copy and the structured data cannot drift.

`Stats` cards fade in and drop into place (y −60px → 0) the first time each one
enters the viewport, while its number counts up from 0 to `value`. With reduced
motion they render in their final state.

**The Wedding gallery is not `Gallery`.** It differs from Home's in layout and
motion, so like the heroes it is page-local: `GalleryWedding`, built as
`GalleryWedding` in `components/wedding/gallery-wedding.tsx`. Don't fold it into
`Gallery` behind a prop.

**Copy is passed in as props** from the page that renders the section, which
reads it from the dictionary (see [Languages](#languages)). Sections never
import copy themselves. Each component exports its item type (`FaqItem`,
`StatItem`, …), so the Wedding FAQ shares the type while keeping its own list
(`home.faq.items` and `wedding.faq.items` in the dictionaries).

---

## Home — `/`

The one page that has to work for a visitor who has never heard of the bakery.
Order is deliberate: what we make → proof it's good → answer the objection →
ask for the order.

| #   | Section      | `id`           | Purpose                                                     | Content / data                                                                                                                                                                                                                                                                                                                                             | Inspiration                                                                                                                                            |
| --- | ------------ | -------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Hero         | `hero`         | Say what Gourmandique is in one glance; primary CTA to Shop | **Page-local.** The tallest hero on the site: grid of pastries + wedding cakes, description that highlights both the regular pastries and wedding cakes OR instead of grid of pastries we do a video combining Mimi baking BTS + final results (pastries, wedding cakes...) `font-display text-h1`, primary CTA → `/shop`, secondary → `/wedding`. Static. | [localcan.com](https://www.localcan.com/)                                                                                                              |
| 2   | Gallery      | `gallery`      | Show the product range; carry the craft                     | 6–9 product images, gallery layout single column layout for mobile. Shopify products (reuse `getProducts`) or curated static set. "See more" → `/shop`.                                                                                                                                                                                                    | layout inspo for desktop https://blog.olivierlarose.com/tutorials/floating-image-gallery each image is a link to a product page                        |
| 3   | Stats        | `stats`        | Social proof in numbers before the words                    | 3–4 figures: cakes baked, weddings served, years baking, 5-star reviews. Static, passed in as props.                                                                                                                                                                                                                                                       | [Lemon Squeezy](https://saaslandingpage.com/lemon-squeezy-about-us/), [Join](https://saaslandingpage.com/join-about-us/)                               |
| 4   | Testimonials | `testimonials` | Proof from customers                                        | 3 quotes, mixed occasions. Static.                                                                                                                                                                                                                                                                                                                         | [Dribbble](https://saaslandingpage.com/dribbble-testimonials/), [Agorapulse](https://saaslandingpage.com/agorapulse-testimonials/) (testimonial cards) |
| 5   | FAQ          | `faq`          | Clear the blockers: lead time, delivery, allergens, custom  | 5–7 Q&A, general-purpose.                                                                                                                                                                                                                                                                                                                                  | Same as alexonmedia, but adapt styling                                                                                                                 |
| 6   | Instagram    | `instagram`    | Show it's a living bakery; push to follow                   | Same `InstaSection` as About (`components/insta/`), live feed of the latest posts plus a follow CTA with the handle. See the Instagram section notes under About.                                                                                                                                                                                          | Same as alexonmedia, but modify styling                                                                                                                |
| 7   | CTA          | `cta`          | Convert the visitor whose questions are now answered        | `CtaBanner` on `bg-accent` with `text-on-accent`. Primary → `/shop`, secondary → `/wedding`. Background images of pastries + wedding cakes.                                                                                                                                                                                                                |                                                                                                                                                        |

**The hero currently opens as a curtain.** [home/hero.tsx](components/home/hero.tsx)
renders the `GourmandiqueWordmark` on a full-screen `bg-accent` panel that is
`fixed` above the page (out of the flow), writes the word, then lifts off the
top and reveals the page. The lift is CSS, delayed by the wordmark's exported
`WORDMARK_SECONDS`. It plays **once per page load**: every refresh or new
tab plays it, coming back to `/` through a client-side navigation doesn't.
[curtain-gate.tsx](components/home/curtain-gate.tsx) handles the skip and stops
scrolling while it is down. It sits above everything, the Sonner toaster
included. The curtain ends `visibility: hidden`, so the `<h1>` lives in the
in-flow hero, not inside it.

Replace the current `ThreeItemGrid` + `Carousel` body of
[page.tsx](app/[lang]/page.tsx). Both are template components; `ThreeItemGrid` can be
retired or recast as the Gallery.

Its description now comes from `metadata.home` in the dictionaries; it still
needs a real title.

---

## Shop — `/shop`

A browse page, not a landing page. The hero stays short; products start above
the fold on desktop.

| #   | Section       | `id`       | Purpose                           | Content / data                                                                                                                                                                       | Inspiration |
| --- | ------------- | ---------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| 1   | Hero          | `hero`     | Orient, then get out of the way   | **Page-local**, and the shortest on the site. Title + one line, no image or a thin banner. Static. Lives in `app/[lang]/shop/layout.tsx` so it also sits above `/shop/[collection]`. |             |
| 2   | Products list | `products` | Browse, filter, sort, add to cart | Shopify Storefront via `getProducts` / `getCollectionProducts`. Reuse `Collections` (sidebar), `FilterList` (sort), `Grid` + `ProductGridItems`.                                     |             |

Products section notes:

- Collection filtering and sort already work via search params — keep that
  contract so links like `/shop?sort=price-asc` stay shareable.
- Needs an **empty state** (no products in a collection) and a **loading state**
  (reuse the pattern in [search/loading.tsx](app/[lang]/search/loading.tsx)).
- On mobile the collection sidebar collapses above the grid — that behaviour is
  in the existing search layout; don't rebuild it.

---

## Wedding — `/wedding`

A single-goal page: get a consultation booked. Every section points at
`#booking`.

| #   | Section        | `id`           | Purpose                                         | Content / data                                                                                                                                                                  | Inspiration                                                                                                                                                                   |
| --- | -------------- | -------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hero           | `hero`         | Set the tone; CTA jumps to the form             | **Page-local.** The most editorial hero — wedding-cake image, generous whitespace, single primary CTA → `#booking`. Static.                                                     |                                                                                                                                                                               |
| 2   | GalleryWedding | `gallery`      | The actual portfolio — the strongest asset here | **Page-local** (`GalleryWedding`), not the shared `Gallery`. 9–12 past wedding cakes, larger tiles than Home. Captions welcome (venue, season). Static set, passed in as props. | https://blog.olivierlarose.com/tutorials/zoom-parallax or https://www.youtube.com/watch?v=edRm_AnGGTo (which we could reuse for our Gallery component? Is it elegant though?) |
| 3   | Testimonials   | `testimonials` | Wedding-specific quotes only                    | 3–4 quotes from couples, with wedding date or venue. Separate list from Home's.                                                                                                 | [Dribbble](https://saaslandingpage.com/dribbble-testimonials/), [Agorapulse](https://saaslandingpage.com/agorapulse-testimonials/) (testimonial cards)                        |
| 4   | FAQ            | `faq`          | Wedding-specific blockers                       | Lead time, tastings, servings per tier, delivery & setup, deposit, dietary. Different list from Home's — same component.                                                        | Same as alexonmedia, but adapt styling                                                                                                                                        |
| 5   | Booking        | `booking`      | Capture the enquiry with a date                 | Form + date/calendar picker. **This is the conversion point** — the CTA anchor target.                                                                                          |                                                                                                                                                                               |

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

| #   | Section   | `id`        | Purpose                                   | Content / data                                                                                                                                                          | Inspiration                                                                                                                                                                                            |
| --- | --------- | ----------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Hero      | `hero`      | Meet Meriem and her passion for baking    |                                                                                                                                                                         | effect could be [Olivier Larose — background image parallax](https://blog.olivierlarose.com/tutorials/background-image-parallax) with this layout as inspo: https://saaslandingpage.com/join-about-us/ |
| 2   | Stats     | `stats`     | Ground the story in numbers               | Same component as Home; may reuse the same figures.                                                                                                                     | [Lemon Squeezy](https://saaslandingpage.com/lemon-squeezy-about-us/), [Join](https://saaslandingpage.com/join-about-us/)                                                                               |
| 3   | Instagram | `instagram` | Show it's a living bakery; push to follow | **Live feed** via the Instagram API: carousel of the latest posts, each linking to Instagram, plus a follow CTA with the handle. `InstaSection` in `components/insta/`. | Same as alexonmedia, but modify styling                                                                                                                                                                |
| 4   | CTA       | `cta`       | Convert the reader who now likes her      | `CtaBanner` on `bg-accent` with `text-on-accent`. Primary → `/shop`, secondary → `/wedding`. Background images of pastries + wedding cakes.                             |                                                                                                                                                                                                        |

Instagram section notes:

- **Decided: live feed**, not a static grid. `InstaSection` (a server component)
  reads `graph.instagram.com` with the bakery's user ID and a long-lived access
  token, so the account must be a business or creator account. The token
  expires after 60 days, so it needs a refresh before then or the section
  silently renders nothing.
- Caching is already worked out in `instaSection.tsx`: the media list
  revalidates every 4 hours, each post every 15 minutes, because Instagram's
  media URLs expire within days. Keep those numbers unless the expiry behaviour
  changes.
- Need to remember to create a Vercel cron job to refresh the instagram token and update the environment variable.

---

## Contact — `/contact`

Deliberately minimal. No hero, no upsell.

| #   | Section | `id`      | Purpose                       | Content / data                                                                               | Inspiration                                        |
| --- | ------- | --------- | ----------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 1   | Contact | `contact` | One place to reach the bakery | email, phone, address, hours, social links, pickup location included but not actual address. | https://saaslandingpage.com/cataphract-about-us-2/ |

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

One decision is still open and changes the work:

1. **Booking calendar** — third-party embed or native form? Decides the client
   JavaScript, the data store, and what availability means.

Per-page checklist as each one is built:

- `generateMetadata` with a real title and description, both from the page's
  `metadata.*` keys in the dictionaries (`metadata.shop` already exists for
  `/search`; move it with the route). Add `alternates.languages` for both
  locales, as the home page does.
- Every string in both dictionaries, every link through `localizePath`. Check
  the page at `/en/…` and `/fr/…` before calling it done: French runs about
  20% longer, so test headings and buttons at the narrowest breakpoint.
- Sections in the order above, each with its `id`.
- Tokens from [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) only — semantic names
  (`bg-surface`, `text-ink`, `text-on-accent`), no `dark:` variants, no raw hex.
- Headings go `font-display` + `text-h*`; one `<h1>` per page, in the hero.
- `next/image` with explicit `sizes` for every gallery and product image.
