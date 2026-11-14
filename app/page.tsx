import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import { HomeHero } from "components/home/hero";
import { Header } from "components/layout/navigation/header";
import { CtaBanner } from "components/sections/cta-banner";
import { homeCta } from "lib/content/cta";

export const metadata = {
  description:
    "High-performance ecommerce store built with Next.js, Vercel, and Shopify.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      {/* <Navbar /> */}
      <Header />
      <HomeHero />
      <ThreeItemGrid />
      <Carousel />
      <CtaBanner {...homeCta} />
    </>
  );
}
