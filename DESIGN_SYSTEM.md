# Gourmandique — Design System

Everything below is derived from `public/images/gourmandiqueLogo.jpg`. Two colours
were sampled from the file itself, not estimated:

| Role      | Hex       | Where it came from                  |
| --------- | --------- | ----------------------------------- |
| Brand ink | `#045350` | The engraved **G** (modal dark hue) |
| Parchment | `#FFFCF3` | The plate the mark sits on          |

Ink on parchment measures **8.7:1** — WCAG AAA at any size.

Tokens live in a single `@theme` block in [globals.css](app/globals.css).
Tailwind v4 generates the utilities; there is no `tailwind.config.js`.

---

## Colour

### `brand-*` — the accent

`brand-700` **is** the logo ink. The ramp is built around it so the accent can
darken and lighten without drifting in hue.

| Step  | Hex       | Use                                   |
| ----- | --------- | ------------------------------------- |
| `50`  | `#EDF6F5` | Tinted backgrounds, selection in dark |
| `100` | `#D3E8E6` |                                       |
| `200` | `#A8D2CE` | Selection highlight (light)           |
| `300` | `#74B5B0` | **Accent on dark grounds**            |
| `400` | `#43938E` |                                       |
| `500` | `#1E7470` |                                       |
| `600` | `#0A605C` | Focus rings (light)                   |
| `700` | `#045350` | **The logo ink — primary accent**     |
| `800` | `#054240` | Hover on filled accent                |
| `900` | `#063432` | Pressed                               |
| `950` | `#00211F` |                                       |

`brand-700` is too dark to read against a dark ground, so dark mode steps the
accent up to `brand-300`. The semantic `accent` token does this for you.

### `neutral-*` — warm, not grey

This **replaces** Tailwind's stock `neutral` ramp. Every `bg-neutral-50` and
`border-neutral-200` already in the codebase inherits the parchment cast with no
component edits. `neutral-50` is the logo background exactly.

| Step  | Hex       | Use                                     |
| ----- | --------- | --------------------------------------- |
| `50`  | `#FFFCF3` | **Page background — the logo's ground** |
| `100` | `#FAF6EB` | Sunken panels                           |
| `200` | `#F0EAD9` | Hairline borders on parchment           |
| `300` | `#DFD7C6` | Stronger rules, disabled edges          |
| `400` | `#B9B0A0` | Placeholder text                        |
| `500` | `#8C857A` | Lightest text still passing AA          |
| `600` | `#6B655C` | Secondary text                          |
| `700` | `#4A463F` | Body text, muted                        |
| `800` | `#2E2B27` | Dark borders                            |
| `900` | `#1C1A17` | **Primary text**                        |
| `950` | `#110F0D` | Deepest ground                          |

Never use pure `#000` or `#FFF` — `bg-paper` (`#FFFCF3`) and `bg-soot`
(`#141311`) keep the warm cast at both ends.

### Semantic tokens (prefer these)

Role names, not colour names. `bg-surface` says what the thing **is**;
`bg-neutral-50` only says what it looks like. Reach for these first.

| Utility              | Value     | Role                                  |
| -------------------- | --------- | ------------------------------------- |
| `bg-surface`         | `#FFFCF3` | The page — the logo's own ground      |
| `bg-surface-raised`  | `#FFFFFF` | Cards, panels, modals                 |
| `bg-surface-sunken`  | `#FAF6EB` | Wells, inset rows, skeletons          |
| `text-ink`           | `#1C1A17` | Primary text                          |
| `text-ink-muted`     | `#4A463F` | Secondary text                        |
| `text-ink-subtle`    | `#8C857A` | Tertiary — still AA on parchment      |
| `border-line`        | `#F0EAD9` | Hairline borders (the global default) |
| `border-line-strong` | `#DFD7C6` | Emphasised rules                      |
| `bg-accent`          | `#045350` | The logo ink                          |
| `bg-accent-hover`    | `#063432` | Hover on filled accent                |
| `text-on-accent`     | `#FFFCF3` | Text and icons sitting on the accent  |

> **Always pair `bg-accent` with `text-on-accent`** rather than `text-white`,
> so the pairing survives any future change to the accent.

Status colours are deliberately desaturated so they sit beside the teal rather
than fight it: `success` `#2F6F4F`, `danger` `#9B3B2F`, `warning` `#A8761F`.

### This site is light only

There is no dark theme. The parchment **is** the brand, and a dark variant
dilutes the one colour the identity is built on.

That decision is **declared, not merely implied**. Chrome on Android applies
[Auto Dark Theme](https://developer.chrome.com/blog/auto-dark-theme) —
algorithmically inverting light pages when the OS is in dark mode — to sites
that stay silent. Saying nothing would hand the palette to an algorithm. So the
opt-out is stated twice:

- `html { color-scheme: only light }` in [globals.css](app/globals.css)
- `export const viewport = { colorScheme: "only light" }` in
  [layout.tsx](app/layout.tsx), which lands earlier in the parse and prevents a
  flash of darkened content

**`only light` is the opt-out; plain `light` is not.** `light` states what the
page supports without forbidding the browser's own inversion. If you ever
change this line, change it to `light dark`, not `light`.

No component should contain a `dark:` variant. The 90 inherited from the
Vercel Commerce template were removed.

<details>
<summary>If dark mode is ever wanted again</summary>

The structure is still there. Point each semantic token at a runtime variable
and redefine those variables in a media query — no component has to change,
because components reference roles rather than literals:

```css
@theme {
  --color-surface: var(--surface);
  /* … */
}
:root {
  --surface: #fffcf3;
}
@media (prefers-color-scheme: dark) {
  :root {
    --surface: #141311;
  }
}
```

One thing to carry over: `brand-700` is too dark to read on a dark ground, so
the accent has to step up the ramp to `brand-300` (`#74B5B0`), and
`text-on-accent` has to invert with it.

</details>

---

## Typography

Two faces, both from Google Fonts, both loaded through `next/font/google` in
[fonts.ts](app/fonts.ts) — self-hosted, preloaded, zero layout shift, no
network request to Google at runtime.

### Cormorant Garamond — `font-display`

A high-contrast Garamond revival whose **true italic** echoes the copperplate
flourish of the mark. This is the brand voice: headings, product titles, pull
quotes. Never UI chrome, never long body copy.

```tsx
<h1 className="font-display text-h1 italic">Gourmandique</h1>
```

Loaded as a variable font (weights 300–700) with both roman and italic.

### Inter — `font-sans`

The neutral workhorse, applied to `<body>` as the default. Tall x-height and
tabular figures keep prices, quantities and form labels legible at small sizes.
Loaded variable, 100–900, roman and italic.

### Scale

Each `text-h*` token carries its own size, line-height **and** tracking, so a
heading needs one class, not three. All four are fluid via `clamp()` — they
scale with the viewport, no breakpoint variants needed.

| Utility        | Min         | Max         | Use                                                            |
| -------------- | ----------- | ----------- | -------------------------------------------------------------- |
| `text-h1`      | `2.5rem`    | `4rem`      | Page / hero title                                              |
| `text-h2`      | `1.875rem`  | `2.75rem`   | Section title                                                  |
| `text-h3`      | `1.375rem`  | `1.75rem`   | Card and product titles                                        |
| `text-h4`      | `1.125rem`  | `1.3125rem` | Sub-headings                                                   |
| `text-eyebrow` | `0.6875rem` | —           | Nav labels, kickers — uppercase, `0.18em` tracking, weight 500 |

`tracking-luxe` (`0.18em`) is available separately for letterspaced small caps.

These are **opt-in utilities**; bare `<h1>` elements are left unstyled so
existing pages are unaffected. Apply `font-display text-h1` where you want the
brand voice.

---

## Shape, depth, motion

| Token           | Value                                          |
| --------------- | ---------------------------------------------- |
| `rounded-card`  | `0.75rem` — tiles, panels, images              |
| `rounded-pill`  | full — buttons, badges, chips                  |
| `shadow-soft`   | resting elevation                              |
| `shadow-lifted` | hover / overlay elevation                      |
| `ease-silk`     | `cubic-bezier(.22,.61,.36,1)` — default easing |

Shadows are **warm-tinted** (`oklch(.25 .03 85 / …)`). A neutral black shadow
reads as dirt on a cream ground.

---

## Usage notes

**Focus rings** are handled globally in `globals.css` for `a`, `input` and
`button` — `ring-accent`, offset against `surface`. Don't re-declare them.

**Borders default to `line`.** The base layer sets `border-color` to
`--color-line` on every element, so `border` and `border-b` alone already give
the right hairline. Only name a colour when you want a different one.

**Prefer a single semantic class to a light/dark pair.** Now that there is no
dark theme, `bg-white` is just `bg-surface-raised` and `text-black` is just
`text-ink` — one class, and it tracks the palette if the palette moves.

### Adding a token

Add it to the `@theme` block in [globals.css](app/globals.css). Tailwind
generates the utility from the variable name: `--color-foo-500` → `bg-foo-500`,
`--text-foo` → `text-foo`, `--radius-foo` → `rounded-foo`. Values are plain
literals — see the light-only note above for what changes if that is ever
revisited.
