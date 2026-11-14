// Copy for the closing CtaBanner on each page that has one.

export type CtaLink = {
  text: string;
  href: string;
};

export type CtaContent = {
  eyebrow?: string;
  title: string;
  body: string;
  primary: CtaLink;
  secondary?: CtaLink;
  // Decorative background photos — pastries and wedding cakes. Up to four.
  images: string[];
};

// Placeholder until real photography lands.
const PLACEHOLDER = "/images/mimiWeddingCake.jpg";
const IMAGES = [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];

export const homeCta: CtaContent = {
  eyebrow: "Ready when you are",
  title: "Something sweet for today, or the cake for your big day.",
  body: "Order pastries baked in small batches, or start planning a wedding cake designed with you.",
  primary: { text: "Shop pastries", href: "/shop" },
  secondary: { text: "Plan your wedding cake", href: "/wedding" },
  images: IMAGES,
};

// For the About page (`/about`, not built yet).
export const aboutCta: CtaContent = {
  eyebrow: "Taste it for yourself",
  title: "Every cake is baked by Meriem, by hand.",
  body: "Browse this week's pastries, or tell her about the wedding cake you have in mind.",
  primary: { text: "Shop pastries", href: "/shop" },
  secondary: { text: "Plan your wedding cake", href: "/wedding" },
  images: IMAGES,
};
