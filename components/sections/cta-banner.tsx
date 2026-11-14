import clsx from "clsx";
import { Button } from "components/button";
import Image from "next/image";
import type { ReactNode } from "react";

// The closing ask on a page: a full-bleed accent band with a title, a line of
// copy and two buttons, over a strip of pastry and wedding-cake photos.
//
// The title (`children`) and `body` are nodes, so a page can break them where it
// wants with a <br />.
//
// The photos are decorative — the copy carries the meaning — so they render
// with empty alt text behind an accent wash that keeps `text-on-accent` legible.
// Two show on mobile, four from `md` up.
//
// It is usually the last section before the footer. The footer's reveal needs
// nothing from it (see PAGE_STRUCTURE.md, "Page shell").

type CtaLink = {
  text: string;
  href: string;
};

type CtaBannerProps = {
  id?: string;
  children: ReactNode;
  body: ReactNode;
  primary: CtaLink;
  secondary?: CtaLink;
  // Decorative background photos — pastries and wedding cakes. Up to four.
  images: string[];
};

export function CtaBanner({
  id = "cta",
  children,
  body,
  primary,
  secondary,
  images,
}: CtaBannerProps) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="relative isolate overflow-hidden bg-accent py-20 text-on-accent md:py-28"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 grid grid-cols-2 md:grid-cols-4"
      >
        {images.slice(0, 4).map((src, i) => (
          <div
            key={i}
            className={clsx("relative", i >= 2 && "hidden md:block")}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-accent/75" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-6 text-center">
        <h2 id={titleId} className="max-w-3xl font-display text-h2">
          {children}
        </h2>
        <p className="max-w-xl text-lg leading-[1.2] text-on-accent/85">
          {body}
        </p>
        {/* Stacked below `sm`, the grid sizes to the wider button and stretches
            the other to match; from `sm` up they sit side by side at their own
            widths. */}
        <div className="mt-2 grid gap-3 sm:grid-flow-col sm:auto-cols-max">
          <Button
            href={primary.href}
            text={primary.text}
            style="primary"
            ground="accent"
          />
          {secondary ? (
            <Button
              href={secondary.href}
              text={secondary.text}
              style="secondary"
              ground="accent"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
