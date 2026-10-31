# Gourmandique

Storefront for Gourmandique, a bakery. Built on the Vercel Next.js Commerce
template (Next.js App Router, React 19, Shopify Storefront API, Tailwind v4,
GSAP). `README.md` is the template's original and does not describe this
project.

## Where to find things

Read the relevant doc **before** building or restyling anything. These are the
source of truth; don't re-derive their decisions from the code.

- **[PAGE_STRUCTURE.md](PAGE_STRUCTURE.md)** says what each page **is**: the
  route map, the sections on every page in order with their `id`s, the
  section anatomy (container, vertical rhythm), the shared section components
  in `components/sections/`, where content lives (`lib/content/`), and the
  pending `/search` → `/shop` rename. Read it when adding or changing a page,
  route, or section.
- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** says what things **look like**:
  colour ramps and semantic tokens, typography (`font-display`, `text-h*`),
  radii, shadows, easing, and the light-only decision. Read it when writing any
  `className` or adding a token.

Tokens themselves live in the `@theme` block in
[app/globals.css](app/globals.css); fonts in [app/fonts.ts](app/fonts.ts).

## Rules that are easy to get wrong

- Use semantic tokens (`bg-surface`, `text-ink`, `border-line`, `bg-accent` +
  `text-on-accent`). No raw hex, no `text-white`/`bg-white`/`text-black`.
- **No `dark:` variants.** The site is light only, declared via
  `color-scheme: only light`. Don't change that to plain `light`.
- There is no `tailwind.config.js`. New tokens go in `@theme` in `globals.css`.
- Headings: `font-display text-h*`. One `<h1>` per page, in that page's hero.
- Heroes are page-local; don't unify them into one component with variants.
- The footer belongs in the root layout (moving it there is still pending), so
  don't import it into new pages.

## Commands

- `pnpm dev` runs the dev server (Turbopack).
- `pnpm build` runs a production build.
- `pnpm test` runs a Prettier check (the only test there is).
- `pnpm prettier` formats the repo.

## Keeping the docs current

When a decision in either doc changes, or a "To build" / "open decision" item
in PAGE_STRUCTURE.md gets done, update the doc in the same change.
