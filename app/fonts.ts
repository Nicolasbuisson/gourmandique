import { Cormorant_Garamond, Inter } from "next/font/google";

/**
 * Display face — Cormorant Garamond.
 * High-contrast Garamond revival whose true italic echoes the copperplate
 * flourish in the Gourmandique mark. Reserved for headings, product titles
 * and pull quotes; never for UI chrome or long body copy.
 *
 * Exposed as `--font-cormorant`, surfaced through the `font-display` utility.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

/**
 * Text face — Inter.
 * Neutral UI workhorse with tall x-height and tabular figures, which keeps
 * prices, quantities and form labels legible at small sizes.
 *
 * Exposed as `--font-inter`, surfaced through the `font-sans` utility.
 */
export const inter = Inter({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-inter",
});

/** Convenience: every font variable, ready to spread onto <html>. */
export const fontVariables = `${cormorant.variable} ${inter.variable}`;
