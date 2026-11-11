"use client";
import { motion } from "motion/react";
import { useState } from "react";
import { height } from "./anim";
import { Body } from "./body";
import { Footer } from "./footer";
import { HeaderImage } from "./headerImage";

const links = [
  {
    title: "Home",
    href: "/",
    src: "mimiWeddingCake.jpg",
    alt: "home page image",
  },
  {
    title: "Shop",
    href: "/shop",
    src: "gourmandiqueLogo.jpg",
    alt: "pastries",
  },
  {
    title: "Wedding",
    href: "/wedding",
    src: "mimiWeddingCake.jpg",
    alt: "wedding cake",
  },
  {
    title: "About",
    href: "/about",
    src: "gourmandiqueLogo.jpg",
    alt: "picture of founder",
  },
  {
    title: "Contact",
    href: "/contact",
    src: "gourmandiqueLogo.jpg",
    alt: "contact page image",
  },
];

export const Nav = () => {
  const [selectedLink, setSelectedLink] = useState({
    isActive: false,
    index: 0,
  });

  return (
    <motion.div
      variants={height}
      initial="initial"
      animate="enter"
      exit="exit"
      className="overflow-hidden"
    >
      <div className="mb-20 flex gap-12.5 pb-2.5 sm:pb-5 lg:mb-0 lg:justify-between">
        <div className="flex flex-col justify-between">
          <Body
            links={links}
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
          />
          <Footer />
        </div>
        <HeaderImage
          src={links[selectedLink.index]!.src}
          isActive={selectedLink.isActive}
          alt={links[selectedLink.index]!.alt}
        />
      </div>
    </motion.div>
  );
};
