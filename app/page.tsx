import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import { HomeHero } from "components/home/hero";
import { Header } from "components/layout/navigation/header";
import { CtaBanner } from "components/sections/cta-banner";

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
      <CtaBanner
        body={
          <>
            Order pastries baked in small batches,
            <br />
            or start planning a wedding cake designed with you.
          </>
        }
        primary={{ text: "Pastries", href: "/shop" }}
        secondary={{ text: "Wedding cake", href: "/wedding" }}
        // Placeholder until real photography lands.
        images={Array(4).fill("/images/mimiWeddingCake.jpg")}
      >
        <>
          Something sweet for today,
          <br />
          or the cake for your big day
        </>
      </CtaBanner>
    </>
  );
}
