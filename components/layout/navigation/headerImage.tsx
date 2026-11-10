import { motion } from "motion/react";
import Image from "next/image";
import { opacity } from "./anim";

export const HeaderImage = ({
  src,
  isActive,
  alt,
}: {
  src: string;
  isActive: boolean;
  alt: string;
}) => {
  return (
    <motion.div
      variants={opacity}
      initial="initial"
      animate={isActive ? "open" : "closed"}
      className="relative hidden h-112.5 w-125 lg:block"
    >
      <Image
        src={`/images/${src}`}
        fill={true}
        sizes="500px"
        alt={alt}
        className="object-cover"
      />
    </motion.div>
  );
};
