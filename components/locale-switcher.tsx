"use client";

import type { Dictionary } from "dictionaries";
import { locales, switchLocalePath } from "lib/i18n";
import { useLocale } from "lib/use-locale";
import Link from "next/link";
import { usePathname } from "next/navigation";

// "EN / FR": links to the current page in each locale. The current locale is
// plain text, the other a link. Each label is in its own language (and tagged
// with `lang`) so a visitor who can't read the current one still finds theirs.
//
// The middleware stores the choice in a cookie as the new URL loads, so `/`
// sends the visitor back to it next time.

export function LocaleSwitcher({
  labels,
  className,
}: {
  labels: Dictionary["languageSwitcher"];
  className?: string;
}) {
  const lang = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={labels.label} className={className}>
      <ul className="flex items-center gap-2 uppercase">
        {locales.map((locale, i) => (
          <li key={locale} className="flex items-center gap-2">
            {i > 0 ? (
              <span aria-hidden className="text-ink-subtle">
                /
              </span>
            ) : null}
            {locale === lang ? (
              <span
                lang={locale}
                aria-current="true"
                title={labels[locale]}
                className="text-ink"
              >
                {locale}
              </span>
            ) : (
              <Link
                href={switchLocalePath(pathname, locale)}
                hrefLang={locale}
                lang={locale}
                title={labels[locale]}
                aria-label={labels[locale]}
                className="text-ink-subtle transition-colors hover:text-ink"
              >
                {locale}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
