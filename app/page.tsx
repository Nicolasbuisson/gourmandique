import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import { HomeHero } from "components/home/hero";
import Footer from "components/layout/footer";
import { Header } from "components/layout/navigation/header";

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
      <Footer />
    </>
  );
}
