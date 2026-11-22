"use client";
import type { Dictionary } from "dictionaries";
import { localizePath } from "lib/i18n";
import { useLocale } from "lib/use-locale";
import { motion } from "motion/react";
import { useState } from "react";
import { height } from "./anim";
import { Body } from "./body";
import { Footer } from "./footer";
import { HeaderImage } from "./headerImage";

// The menu's pages, in order, with the photo shown while each is hovered.
// Titles and alt text come from the dictionary.
const LINKS = [
  { key: "home", href: "/", src: "mimiWeddingCake.jpg" },
  { key: "shop", href: "/shop", src: "gourmandiqueLogo.jpg" },
  { key: "wedding", href: "/wedding", src: "mimiWeddingCake.jpg" },
  { key: "about", href: "/about", src: "gourmandiqueLogo.jpg" },
  { key: "contact", href: "/contact", src: "gourmandiqueLogo.jpg" },
] as const;

export const Nav = ({ labels }: { labels: Dictionary["nav"] }) => {
  const lang = useLocale();
  const links = LINKS.map(({ key, href, src }) => ({
    title: labels.links[key],
    alt: labels.images[key],
    href: localizePath(lang, href),
    src,
  }));
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
          <Footer labels={labels.credits} />
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
