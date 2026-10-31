import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import { HomeHero } from "components/home/hero";
import Footer from "components/layout/footer";
import { Navbar } from "components/layout/navbar";

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
      <HomeHero />
      <Navbar />
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
