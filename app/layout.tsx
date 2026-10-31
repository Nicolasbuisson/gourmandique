import { CartProvider } from "components/cart/cart-context";
import { WelcomeToast } from "components/welcome-toast";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import type { Viewport } from "next";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { fontVariables } from "./fonts";
import "./globals.css";

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

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="en" className={fontVariables}>
      <body className="bg-surface font-sans text-ink selection:bg-brand-200 selection:text-brand-900">
        <CartProvider cartPromise={cart}>
          <main>
            {children}
            <Toaster closeButton />
            <WelcomeToast />
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
