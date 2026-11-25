import { CartProvider } from "components/cart/cart-context";
import Footer from "components/layout/footer";
import { WelcomeToast } from "components/welcome-toast";
import { intlLocale, isLocale, locales } from "lib/i18n";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { lang as rootLang } from "next/root-params";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { fontVariables } from "../fonts";
import "../globals.css";

const { SITE_NAME } = process.env;

/**
 * The parchment palette is the brand, so the site ships light only.
 * `only light` opts out of Chrome Android's Auto Dark Theme, which would
 * otherwise invert the palette algorithmically. Plain `light` would not —
 * it states a preference without forbidding the browser's own inversion.
 */
export const viewport: Viewport = {
  colorScheme: "only light",
};

// This is the root layout: every page sits under `/[lang]` (see
// proxy.ts), so `<html lang>` can be set from the URL. Both locales are
// prerendered; any other first segment is a 404. Because `[lang]` is the
// root segment, any server component below can read it with `getLocale()`
// or `getDictionary()` instead of having it passed down.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await rootLang();
  if (!isLocale(lang)) return {};

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: SITE_NAME!,
      template: `%s | ${SITE_NAME}`,
    },
    robots: {
      follow: true,
      index: true,
    },
    openGraph: {
      locale: intlLocale[lang].replace("-", "_"),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Read raw rather than through getLocale(), which falls back to the default.
  const lang = await rootLang();
  if (!isLocale(lang)) notFound();

  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang={lang} className={fontVariables}>
      <body className="bg-surface font-sans text-ink selection:bg-brand-200 selection:text-brand-900">
        <CartProvider cartPromise={cart}>
          <main>
            {children}
            <Toaster closeButton />
            <WelcomeToast />
          </main>
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
