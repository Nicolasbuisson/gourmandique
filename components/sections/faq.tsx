"use client";

import clsx from "clsx";
import { useId, useState } from "react";

// Frequently asked questions as an accordion. Only one answer is open at a
// time: opening a question closes the one that was open, and clicking the open
// one closes it.
//
// Each answer opens with the grid-row trick: the panel is a one-row grid whose
// row transitions between `0fr` and `1fr`, and its only child clips with
// `overflow-hidden`, so the answer grows to its natural height with no
// measuring. A closed answer is `inert`, so nothing inside it can be focused or
// read out.
//
// The icon is a "+" made of two bars. Opening shrinks the vertical bar's
// height to zero, leaving the "−"; closing grows it back.
//
// FAQPage JSON-LD is emitted from the same `items` array, so the copy on the
// page and the structured data cannot drift.

export type FaqItem = {
  q: string;
  a: string;
};

type FaqProps = {
  id?: string;
  eyebrow: string;
  title: string;
  items: FaqItem[];
};

export function Faq({ id = "faq", eyebrow, title, items }: FaqProps) {
  const titleId = `${id}-title`;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="bg-surface py-20 md:py-28"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <p className="text-eyebrow text-ink-subtle uppercase">{eyebrow}</p>
          <h2 id={titleId} className="mt-3 font-display text-h2 text-ink">
            {title}
          </h2>
        </div>

        <ul className="border-t border-line-strong">
          {items.map((item, i) => (
            <FaqRow
              key={item.q}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function FaqRow({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  const uid = useId();
  const buttonId = `${uid}-question`;
  const panelId = `${uid}-answer`;

  return (
    <li className="border-b border-line-strong">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-h4 text-ink"
        >
          <span>{item.q}</span>
          <span aria-hidden className="relative size-4 shrink-0 text-accent">
            {/* Horizontal bar — always there. */}
            <span className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-current" />
            {/* Vertical bar — its height goes to zero to turn "+" into "−". */}
            <span
              className={clsx(
                "absolute top-1/2 left-1/2 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-current transition-[height] duration-500 ease-silk",
                open ? "h-0" : "h-full",
              )}
            />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        className={clsx(
          "grid transition-[grid-template-rows] duration-500 ease-silk",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 text-ink-muted">{item.a}</p>
        </div>
      </div>
    </li>
  );
}
