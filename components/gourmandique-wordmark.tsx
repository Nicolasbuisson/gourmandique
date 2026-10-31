import {
  FILL,
  PEN,
  TITTLE,
  VIEWBOX,
} from "components/gourmandique-wordmark-paths";

// The "Gourmandique" wordmark, written onto the page.
//
// What you see is FILL: the letterforms traced from the artwork, thick and thin
// intact. They are revealed through a mask, and the mask is the pen — one
// continuous stroke through the word, animated with stroke-dashoffset. So the
// animation is a pen writing the word, but what it leaves behind is the real
// lettering, not a monoline imitation of it.
//
// The pen is cut into consecutive pieces (see PEN), each as wide as the stroke it
// is writing. A single pen would have to be as wide as the heaviest stroke, and
// at every crossing it would uncover a stub of the other stroke long before the
// pen reached it. Each piece starts the moment the previous one ends, so the
// pieces still move as one stroke.
//
// Once the pen finishes and the i is dotted, `gq-settle` fades in a
// full-coverage rect, so the last frame is exactly the artwork with no
// anti-aliased sliver left unrevealed.
//
// The mask id is fixed, so render this once per page.

const MASK_ID = "gourmandique-wordmark-ink";

// How long the pen takes to write the word, first stroke to last.
const PEN_SECONDS = 5;

// Easing across the whole word, as CSS cubic-bezier control points
// [x1, y1, x2, y2]: x is time, y is how much of the word is written. The pen's
// own pacing (retraces glide, strokes are drawn) is kept and warped by this.
//   linear       [0, 0, 1, 1]
//   ease-in-out  [0.42, 0, 0.58, 1]
//   ease-out     [0, 0, 0.58, 1]   fast start, settles into the last letters
// Keep y1 and y2 within 0-1: a curve that overshoots would run the pen backwards.
//
// Current: a softened easeOutCubic. easeOutCubic is
// cubic-bezier(0.215, 0.610, 0.355, 1.000), whose start is ~15x faster than its
// end; here its y values are pulled halfway back toward linear, keeping the
// shape at under 4:1. The "Go" (the first ~40% of the writing) runs at ~1.9x
// average speed, finishing in about 23% of PEN_SECONDS, then the pen eases down
// to ~0.5x by the e. Pull y1 and y2 further toward x1 and x2 to flatten it more,
// or back toward 0.61 and 1 to sharpen it.
const PEN_EASING: readonly [number, number, number, number] = [
  0.215, 0.412, 0.355, 0.677,
];

// The dot and the closing fade follow the pen by a fixed interval, whatever the
// duration, so a slow pen never leaves the i waiting.
// TITTLE_PAUSE is the beat between lifting off the e and dotting the i.
const TITTLE_PAUSE = 0.3;
const TITTLE_SECONDS = 0.18;
const TITTLE_DELAY = PEN_SECONDS + TITTLE_PAUSE;
// The fade starts as the dot lands.
const SETTLE_DELAY = TITTLE_DELAY + TITTLE_SECONDS;

// The time (0-1) at which the eased word reaches a given progress (0-1): solve
// the bezier's y for its parameter, then read x there.
function timeAtProgress(progress: number) {
  const [x1, y1, x2, y2] = PEN_EASING;
  const bez = (s: number, a: number, b: number) =>
    3 * (1 - s) * (1 - s) * s * a + 3 * (1 - s) * s * s * b + s * s * s;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (bez(mid, y1, y2) < progress) lo = mid;
    else hi = mid;
  }
  return bez((lo + hi) / 2, x1, x2);
}

// Each piece keeps its place in the writing; easing decides when it is drawn.
// Inside a piece the pen moves linearly, but the pieces are short enough that
// together they trace the curve.
const TIMED_PEN = PEN.map(([d, width, start, end]) => {
  const t0 = timeAtProgress(start) * PEN_SECONDS;
  const t1 = timeAtProgress(end) * PEN_SECONDS;
  return { d, width, delay: t0, duration: Math.max(t1 - t0, 0.001) };
});

const seconds = (n: number) => `${+n.toFixed(3)}s`;

// The dash gap (2) is longer than the path (pathLength 1). With a gap of 1, the
// next dash in the pattern starts at 0.999 and a round cap shows at the end of
// every piece before it is drawn.
const CSS = `
.gq-pen,.gq-tittle{stroke-dasharray:1 2;stroke-dashoffset:1.001}
.gq-pen{animation-name:gq-draw;animation-timing-function:linear;animation-fill-mode:both}
.gq-tittle{animation:gq-draw ${seconds(TITTLE_SECONDS)} ease-out ${seconds(TITTLE_DELAY)} both}
.gq-settle{opacity:0;animation:gq-settle .3s ease-out ${seconds(SETTLE_DELAY)} both}
@keyframes gq-draw{to{stroke-dashoffset:0}}
@keyframes gq-settle{to{opacity:1}}
@media (prefers-reduced-motion:reduce){
  .gq-pen,.gq-tittle{animation:none;stroke-dashoffset:0}
  .gq-settle{animation:none;opacity:1}
}`;

export function GourmandiqueWordmark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={VIEWBOX}
      aria-hidden="true"
      focusable="false"
    >
      <style>{CSS}</style>
      <defs>
        <mask
          id={MASK_ID}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1720"
          height="524"
        >
          <g
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {TIMED_PEN.map(({ d, width, delay, duration }, i) => (
              <path
                key={i}
                className="gq-pen"
                d={d}
                pathLength={1}
                strokeWidth={width}
                style={{
                  animationDelay: seconds(delay),
                  animationDuration: seconds(duration),
                }}
              />
            ))}
            <path
              className="gq-tittle"
              d={TITTLE}
              pathLength={1}
              strokeWidth={34}
            />
          </g>
          <rect className="gq-settle" width="1720" height="524" fill="#fff" />
        </mask>
      </defs>
      <path
        d={FILL}
        fillRule="evenodd"
        fill="currentColor"
        mask={`url(#${MASK_ID})`}
      />
    </svg>
  );
}
