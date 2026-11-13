import { Button } from "components/button";
import {
  GourmandiqueWordmark,
  WORDMARK_SECONDS,
} from "components/gourmandique-wordmark";
import { CurtainGate } from "components/home/curtain-gate";
import Image from "next/image";

// The hero opens as a curtain: on mount it covers the whole page, fixed and
// out of the flow, while the wordmark is written. Once the writing settles it
// lifts off the top of the screen and reveals the in-flow hero beneath it.
//
// The lift is a CSS animation delayed by WORDMARK_SECONDS, so it runs on the
// same clock as the writing and needs no JavaScript. It plays once per page
// load; CurtainGate skips it on client-side navigation back to the home page,
// and stops the page scrolling behind it while it is down.
//
// At the end the curtain is also made invisible, so it can't catch clicks or be
// read out. The <h1> lives in the in-flow hero, outside it, for that reason.
//
// It sits above everything, the toaster included: Sonner's is z-index
// 999999999, so the curtain is one higher.

const CURTAIN_ID = "hero-curtain";

// The beat between the last frame of the wordmark and the lift.
const HOLD_SECONDS = 0.4;
const LIFT_SECONDS = 1.1;
const LIFT_DELAY = WORDMARK_SECONDS + HOLD_SECONDS;
// easeInOutQuart: the curtain gathers speed, then slows as it leaves, rather
// than snapping off the way an ease-out like ease-silk would.
const LIFT_EASING = "cubic-bezier(0.76, 0, 0.24, 1)";

// With reduced motion the wordmark is already whole on mount, so the curtain
// holds it briefly and fades instead of moving.
const REDUCED_HOLD_SECONDS = 1.2;
const REDUCED_FADE_SECONDS = 0.4;

const CSS = `
#${CURTAIN_ID}{animation:hero-lift ${LIFT_SECONDS}s ${LIFT_EASING} ${+LIFT_DELAY.toFixed(3)}s both}
@keyframes hero-lift{to{transform:translateY(-100%);visibility:hidden}}
@keyframes hero-fade{to{opacity:0;visibility:hidden}}
@media (prefers-reduced-motion:reduce){
  #${CURTAIN_ID}{animation:hero-fade ${REDUCED_FADE_SECONDS}s ease-out ${REDUCED_HOLD_SECONDS}s both}
}`;

type Tile =
  | { kind: "image"; src: string; alt: string }
  | { kind: "label"; eyebrow: string; title: string };

const PLACEHOLDER = "/images/mimiWeddingCake.jpg";

const TILES: Tile[] = [
  { kind: "image", src: PLACEHOLDER, alt: "A tray of fresh pastries" },
  { kind: "label", eyebrow: "Pâtisserie", title: "Baked in small batches" },
  { kind: "image", src: PLACEHOLDER, alt: "Assorted tarts and petits gâteaux" },
  {
    kind: "image",
    src: PLACEHOLDER,
    alt: "A three-tier white wedding cake dressed with roses, gerberas and baby's breath",
  },
  { kind: "label", eyebrow: "Wedding cakes", title: "Designed with you" },
  { kind: "image", src: PLACEHOLDER, alt: "A wedding cake on its stand" },
];

export function HomeHero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="mt-(--header-h) py-4 lg:h-[calc(100svh-var(--header-h))] lg:min-h-[40rem] lg:py-6"
    >
      <style>{CSS}</style>

      <div className="mx-auto h-full w-full max-w-7xl px-6">
        <div className="grid h-full overflow-hidden lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-8 px-6 py-14 md:px-12 lg:px-14">
            <h1 id="hero-title" className="font-display text-h1 text-ink">
              Pastries for every day cravings.{" "}
              <em className="text-accent">Wedding Cakes for your big day.</em>
            </h1>
            <p className="max-w-md text-lg text-ink-muted">
              Homemade tarts and petits gâteaux, and unique wedding cakes
              designed for your special occasion.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/shop" style="primary" text="Shop pastries" />
              <Button
                href="/wedding"
                style="secondary"
                text="Plan your wedding cake"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px lg:grid-rows-3">
            {TILES.map((tile, i) =>
              tile.kind === "image" ? (
                <div
                  key={i}
                  className="relative aspect-square bg-surface lg:aspect-auto"
                >
                  <Image
                    src={tile.src}
                    alt={tile.alt}
                    fill
                    sizes="(min-width: 1280px) 320px, (min-width: 1024px) 25vw, 50vw"
                    priority={i < 2}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  key={i}
                  className="flex aspect-square flex-col items-center justify-center gap-2 bg-surface p-4 text-center lg:aspect-auto"
                >
                  <p className="text-eyebrow text-ink-subtle uppercase">
                    {tile.eyebrow}
                  </p>
                  <p className="font-display text-h3 text-ink italic">
                    {tile.title}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <div
        id={CURTAIN_ID}
        className="fixed inset-0 z-[1000000000] flex items-center justify-center bg-accent"
      >
        <GourmandiqueWordmark className="h-auto w-[min(88vw,64rem)] text-on-accent" />
      </div>
      <CurtainGate curtainId={CURTAIN_ID} />
    </section>
  );
}
