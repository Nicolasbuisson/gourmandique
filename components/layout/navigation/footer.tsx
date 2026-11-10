import { motion } from "motion/react";
import { translate } from "./anim";

export const Footer = () => {
  return (
    <div className="mt-10 flex flex-wrap items-end text-xs uppercase lg:justify-between">
      <ul className="mt-2.5 w-1/2 overflow-hidden lg:w-auto">
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <span className="text-ink-subtle">Made by:</span>Studio Lumio
        </motion.li>
      </ul>
      <ul className="mt-2.5 w-1/2 overflow-hidden lg:w-auto">
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <span className="text-ink-subtle">Typography:</span> Google Fonts
        </motion.li>
      </ul>
      <ul className="mt-2.5 w-1/2 overflow-hidden lg:w-auto">
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <span className="text-ink-subtle">Images:</span> Freepik, Envato
        </motion.li>
      </ul>
      <ul className="mt-2.5 w-1/2 overflow-hidden lg:w-auto">
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          Privacy Policy
        </motion.li>
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          Terms & Conditions
        </motion.li>
      </ul>
    </div>
  );
};
