import { motion } from "motion/react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { blur, translate } from "./anim";

export const Body = ({
  links,
  selectedLink,
  setSelectedLink,
}: {
  links: {
    title: string;
    href: string;
    src: string;
  }[];
  selectedLink: {
    isActive: boolean;
    index: number;
  };
  setSelectedLink: Dispatch<
    SetStateAction<{
      isActive: boolean;
      index: number;
    }>
  >;
}) => {
  const getChars = (word: string) =>
    word.split("").map((char, i) => (
      <motion.span
        custom={[i * 0.02, (word.length - i) * 0.01]}
        variants={translate}
        initial="initial"
        animate="enter"
        exit="exit"
        key={char + i}
      >
        {char}
      </motion.span>
    ));

  return (
    <div className="mt-10 flex flex-wrap lg:mt-20 lg:max-w-300">
      {links.map((link, index) => {
        const { title, href } = link;
        return (
          <Link key={`l_${index}`} href={href} className="text-ink uppercase">
            <motion.p
              className="flex overflow-hidden pt-2.5 pr-7.5 text-[2rem] font-light lg:pr-[2vw] lg:text-[5vw]"
              onMouseOver={() => {
                setSelectedLink({ isActive: true, index });
              }}
              onMouseLeave={() => {
                setSelectedLink({ isActive: false, index });
              }}
              variants={blur}
              animate={
                selectedLink.isActive && selectedLink.index != index
                  ? "open"
                  : "closed"
              }
            >
              {getChars(title)}
            </motion.p>
          </Link>
        );
      })}
    </div>
  );
};
