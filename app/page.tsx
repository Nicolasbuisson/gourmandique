import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import { HomeHero } from "components/home/hero";
import { Header } from "components/layout/navigation/header";
import { CtaBanner } from "components/sections/cta-banner";
import { Faq } from "components/sections/faq";
import { Stats } from "components/sections/stats";

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
      {/* Mock figures until the real ones are in. */}
      <Stats
        eyebrow="By the numbers"
        title="Small batches, adding up"
        items={[
          { value: 2400, suffix: "+", label: "Cakes and pastry boxes baked" },
          { value: 180, suffix: "+", label: "Weddings served" },
          { value: 12, label: "Years baking" },
        ]}
      />
      {/* Mock questions until the real copy is in. */}
      <Faq
        eyebrow="Questions"
        title="Before you order"
        items={[
          {
            q: "How far ahead should I order?",
            a: "Give us 48 hours for pastries and two weeks for a custom celebration cake. Wedding cakes are best booked three to six months ahead, as we take a limited number each weekend.",
          },
          {
            q: "Do you deliver?",
            a: "Yes, within our local delivery zone, with the fee shown at checkout. You can also pick your order up from our kitchen at no charge; we send the pickup details once your order is confirmed.",
          },
          {
            q: "Can you accommodate allergies?",
            a: "We offer gluten-free and dairy-free options for many of our cakes. Our kitchen handles nuts, gluten, dairy and eggs, so we cannot guarantee that any item is free of traces of them.",
          },
          {
            q: "Can I order a custom design?",
            a: "Absolutely. Tell us the occasion, the number of guests and any inspiration you have, and we will sketch a design and quote it for you before anything is baked.",
          },
          {
            q: "How should I store my pastries?",
            a: "Most pastries are best the day they are made. Keep cream-filled pieces and cakes refrigerated, and take them out about 30 minutes before serving so the flavours come through.",
          },
        ]}
      />
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
