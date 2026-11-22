// Locale config shared by the middleware, layouts and components. Edge-safe:
// no Node APIs and no dictionary imports, so the middleware can use it.
//
// The copy itself lives in `dictionaries/` and is loaded with getDictionary().

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

// Used when the browser's Accept-Language matches neither locale.
export const defaultLocale: Locale = "en";

// Remembers the visitor's last locale so `/` sends them back to it.
export const LOCALE_COOKIE = "NEXT_LOCALE";

// BCP 47 tags for Intl formatters (numbers, dates) and `og:locale`.
export const intlLocale: Record<Locale, string> = {
  en: "en-CA",
  fr: "fr-CA",
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

// Narrows a `[lang]` value to a Locale. The root layout already 404s any
// other value, so below it this only satisfies the type checker.
export function asLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

// Prefixes an internal path with the locale: localizePath("fr", "/shop")
// → "/fr/shop", localizePath("fr", "/") → "/fr". External URLs, anchors and
// paths that already carry a locale are returned unchanged.
export function localizePath(lang: Locale, path: string): string {
  if (!path.startsWith("/")) return path;
  const first = path.split(/[/?#]/)[1];
  if (isLocale(first)) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

// Swaps the locale of a path that already carries one: switchLocalePath(
// "/en/shop?q=tart", "fr") → "/fr/shop?q=tart".
export function switchLocalePath(path: string, lang: Locale): string {
  const [, first, ...rest] = path.split("/");
  if (isLocale(first)) return ["", lang, ...rest].join("/");
  return localizePath(lang, path);
}

// Picks the best supported locale from an Accept-Language header, honouring
// q-values: "fr-CA,fr;q=0.9,en;q=0.8" → "fr".
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return {
        lang: tag.toLowerCase().split("-")[0],
        q: q ? Number(q.trim().slice(2)) : 1,
      };
    })
    .filter(({ q }) => q > 0)
    .sort((a, b) => b.q - a.q);

  const match = ranked.find(({ lang }) => isLocale(lang))?.lang;
  return isLocale(match) ? match : defaultLocale;
}
