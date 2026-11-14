import { Button } from "components/button";
import clsx from "clsx";
import Image from "next/image";
import type { CtaContent } from "lib/content/cta";

// The closing ask on a page: a full-bleed accent band with a title, a line of
// copy and two buttons, over a strip of pastry and wedding-cake photos.
//
// The photos are decorative — the copy carries the meaning — so they render
// with empty alt text behind an accent wash that keeps `text-on-accent` legible.
// Two show on mobile, four from `md` up.
//
// It is usually the last section before the footer. The footer's reveal needs
// nothing from it (see PAGE_STRUCTURE.md, "Page shell").

type CtaBannerProps = CtaContent & {
  id?: string;
};

export function CtaBanner({
  id = "cta",
  eyebrow,
  title,
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
        <div className="absolute inset-0 bg-accent/85" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-6 text-center">
        {eyebrow ? (
          <p className="text-eyebrow text-on-accent/80 uppercase">{eyebrow}</p>
        ) : null}
        <h2 id={titleId} className="max-w-3xl font-display text-h2">
          {title}
        </h2>
        <p className="max-w-xl text-lg text-on-accent/85">{body}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
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
