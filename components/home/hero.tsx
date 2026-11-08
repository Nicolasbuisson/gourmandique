import {
  GourmandiqueWordmark,
  WORDMARK_SECONDS,
} from "components/gourmandique-wordmark";
import { CurtainGate } from "components/home/curtain-gate";

// The hero is a curtain: on mount it covers the whole page, fixed and out of
// the flow, while the wordmark is written. Once the writing settles it lifts
// off the top of the screen and leaves the page beneath it.
//
// The lift is a CSS animation delayed by WORDMARK_SECONDS, so it runs on the
// same clock as the writing and needs no JavaScript. It plays once per page
// load; CurtainGate skips it on client-side navigation back to the home page,
// and stops the page scrolling behind it while it is down.
//
// At the end the curtain is also made invisible, so it can't catch clicks or be
// read out. The <h1> stays outside it for that reason.
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

export function HomeHero() {
  return (
    <section id="hero" aria-labelledby="hero-title">
      <style>{CSS}</style>
      {/* The mark is artwork, not text, so the accessible name lives here. */}
      <h1 id="hero-title" className="sr-only">
        Gourmandique
      </h1>
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
