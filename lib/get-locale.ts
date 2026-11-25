import { lang } from "next/root-params";
import { asLocale, type Locale } from "lib/i18n";

// The current request's locale, read from the `[lang]` root segment with
// `next/root-params`, so server components don't need it passed in as a prop.
//
// Server components only. Not inside `"use cache"` (pass the locale in as an
// argument there), server actions or route handlers. Client components use
// `useLocale()` from `lib/use-locale` instead.
export async function getLocale(): Promise<Locale> {
  return asLocale(await lang());
}
