"use client";

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Social proof in numbers: a row of cards, each with one figure and a label.
//
// Each card animates on its own the first time it enters the viewport: it
// fades in (opacity 0 → 1) and drops into place (y -60px → 0) while its
// number counts up from 0 to the real value. Card and number share one
// duration and easing, so the count lands as the card settles.
//
// Screen readers get the final figure straight away; the counting digits are
// decorative and hidden from them. With reduced motion the cards and numbers
// appear in their final state with no movement.
//
// The grid is one column on mobile, then one column per item from `sm` up
// (three or four items).

export type StatItem = {
  value: number;
  label: string;
  // Appended to the number, e.g. "+" for "2,400+".
  suffix?: string;
};

type StatsProps = {
  id?: string;
  eyebrow: string;
  title: string;
  items: StatItem[];
};

const DURATION = 1.4;
// `ease-silk` from the design system.
const EASE = [0.22, 0.61, 0.36, 1] as const;
const OFFSET_Y = 60;

const format = (n: number) => Math.round(n).toLocaleString("en-US");

export function Stats({ id = "stats", eyebrow, title, items }: StatsProps) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="bg-surface-sunken py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <p className="text-eyebrow text-ink-subtle uppercase">{eyebrow}</p>
        <h2
          id={titleId}
          className="mt-3 max-w-2xl font-display text-h2 text-ink"
        >
          {title}
        </h2>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] md:mt-16">
          {items.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function StatCard({ item }: { item: StatItem }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setCount(item.value);
      return;
    }
    const controls = animate(0, item.value, {
      duration: DURATION,
      ease: EASE,
      onUpdate: setCount,
    });
    return () => controls.stop();
  }, [inView, reduceMotion, item.value]);

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: OFFSET_Y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={
        reduceMotion ? { duration: 0 } : { duration: DURATION, ease: EASE }
      }
      className="flex flex-col rounded-card bg-surface-raised p-6 shadow-soft"
    >
      <p className="font-display text-h1 text-accent tabular-nums">
        <span aria-hidden>
          {format(count)}
          {item.suffix}
        </span>
        <span className="sr-only">
          {format(item.value)}
          {item.suffix}
        </span>
      </p>
      <p className="text-ink-muted">{item.label}</p>
    </motion.li>
  );
}
