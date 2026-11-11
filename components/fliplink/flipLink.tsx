"use client";
import clsx from "clsx";
import { motion, type Easing } from "motion/react";
import Link from "next/link";

// A Next.js Link that motion can animate, so internal links navigate
// client-side instead of reloading the page.
const MotionLink = motion.create(Link);

interface FlipLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  // Colour, size and face. The link inherits them, so set them here or on a
  // parent.
  className?: string;
}

export const FlipLink = (props: FlipLinkProps) => {
  const DURATION = 0.325;
  const STAGGER = 0.025;
  // How long the accent wipes off to reveal the letter's own colour.
  const TINT_DURATION = DURATION * 1.5;
  const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const { href, label, onClick, className } = props;
  return (
    <MotionLink
      initial="initial"
      whileHover="hovered"
      href={href}
      className={clsx(
        "relative block w-fit overflow-hidden whitespace-nowrap font-semibold leading-[0.9] no-underline transition-all duration-300 ease-in-out",
        className,
      )}
      onClick={onClick}
      aria-label={label}
    >
      <div aria-hidden="true">
        {label.split("").map((l, i) => (
          <motion.span
            className="inline-block"
            variants={{
              initial: {
                y: 0,
                transition: { duration: DURATION, ease: EASE, delay: 0 },
              },
              hovered: {
                y: "-100%",
                transition: {
                  duration: DURATION,
                  ease: EASE,
                  delay: STAGGER * i,
                },
              },
            }}
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0">
        {label.split("").map((l, i) => {
          // The stagger is baked into `times` rather than `delay` so each
          // keyframe track starts at hover-start, while the letter is still
          // clipped below the fold. A `delay` would instead snap the letter to
          // its first keyframe mid-rise, flashing the gradient in view.
          const fadeHold = STAGGER * i + DURATION * 0.2;
          const fadeTotal = fadeHold + DURATION;
          const tintHold = STAGGER * i + DURATION * 0.8;
          const tintTotal = tintHold + TINT_DURATION;
          // One cubic-bezier per keyframe segment: with keyframes,
          // framer-motion reads a flat array as per-segment easings and would
          // misparse a single bezier as four of them.
          const segmentEase: Easing[] = [EASE, EASE];
          // EASE front-loads nearly all of its change into the first quarter of
          // a segment, which makes the wipe read as instant whatever its
          // duration. Linear spreads it evenly so TINT_DURATION is legible.
          const tintEase: Easing[] = ["linear", "linear"];
          return (
            <motion.span
              className="relative inline-block"
              variants={{
                // Equal to the hovered end state, so the exit is a pure slide
                // down with no fade.
                initial: {
                  y: "100%",
                  opacity: 1,
                  transition: {
                    y: { duration: DURATION, ease: EASE, delay: 0 },
                    opacity: { duration: 0 },
                  },
                },
                hovered: {
                  y: 0,
                  opacity: [0, 0, 1],
                  transition: {
                    y: {
                      duration: DURATION,
                      ease: EASE,
                      delay: STAGGER * i,
                    },
                    opacity: {
                      duration: fadeTotal,
                      ease: segmentEase,
                      times: [0, fadeHold / fadeTotal, 1],
                    },
                  },
                },
              }}
              key={i}
            >
              {l}
              {/* The tint is a static overlay copy of the glyph. Its colour is
                  never animated, so it cannot be overridden by motion's inline
                  `color`; only its opacity is animated to wipe it off and
                  reveal the letter beneath. */}
              <motion.span
                className="absolute top-0 left-0 bg-accent bg-clip-text text-transparent"
                variants={{
                  initial: { opacity: 0, transition: { duration: 0 } },
                  hovered: {
                    opacity: [1, 1, 0],
                    transition: {
                      duration: tintTotal,
                      ease: tintEase,
                      times: [0, tintHold / tintTotal, 1],
                    },
                  },
                }}
              >
                {l}
              </motion.span>
            </motion.span>
          );
        })}
      </div>
    </MotionLink>
  );
};
