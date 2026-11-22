import { CartProvider } from "components/cart/cart-context";
import Footer from "components/layout/footer";
import { WelcomeToast } from "components/welcome-toast";
import { getDictionary } from "dictionaries";
import { intlLocale, isLocale, locales } from "lib/i18n";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
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
// prerendered; any other first segment is a 404.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
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

export default async function RootLayout(props: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { children } = props;
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

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
        <Footer
          lang={lang}
          links={dict.nav.links}
          label={dict.footer.label}
          languageLabel={dict.languageSwitcher}
        />
      </body>
    </html>
  );
}
