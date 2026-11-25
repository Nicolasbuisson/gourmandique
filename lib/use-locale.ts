"use client";

import { asLocale, type Locale } from "lib/i18n";
import { useParams } from "next/navigation";

// Client-side counterpart of `getLocale()`: the locale from the `[lang]`
// segment of the current URL.
export function useLocale(): Locale {
  const { lang } = useParams<{ lang: string }>();
  return asLocale(lang);
}
