import type { Locale } from "lib/i18n";
import type en from "./en.json";

// The site's copy, one JSON file per locale. `en.json` defines the shape;
// `satisfies` makes the build fail if `fr.json` is missing a key or has one
// of the wrong type.
//
// Load it in server components (pages, layouts) and pass the strings down as
// props. Each locale is a separate chunk, so a page only ships its own.

export type Dictionary = typeof en;

const dictionaries = {
  en: () => import("./en.json").then((m) => m.default),
  fr: () => import("./fr.json").then((m) => m.default satisfies Dictionary),
} satisfies Record<Locale, () => Promise<Dictionary>>;

export const getDictionary = (lang: Locale): Promise<Dictionary> =>
  dictionaries[lang]();

// Fills `{name}` placeholders: format("Showing {count} results", { count: 3 }).
export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
