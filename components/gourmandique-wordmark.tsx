import {
  FILL,
  PEN,
  PEN_KEYFRAMES,
  TITTLE,
  VIEWBOX,
} from "components/gourmandique-wordmark-paths";

// The "Gourmandique" wordmark, written onto the page.
//
// What you see is FILL: the letterforms traced from the artwork, thick and thin
// intact. They are revealed through a mask, and the mask is a single stroke —
// PEN — animated with stroke-dashoffset. So the animation is a pen writing the
// word in one continuous movement, but what the pen leaves behind is the real
// lettering, not a monoline imitation of it.
//
// The pen is 34 units wide, enough to cover the heaviest stroke (the G's stem).
// Once it finishes and the i is dotted, `gq-settle` fades in a full-coverage
// rect, so the last frame is exactly the artwork with no sliver left unrevealed.
//
// The mask id is fixed, so render this once per page.

const MASK_ID = "gourmandique-wordmark-ink";
const PEN_SECONDS = 5.2;

const CSS = `
.gq-pen{stroke-dasharray:1 1;stroke-dashoffset:1;animation:gq-write ${PEN_SECONDS}s linear both}
.gq-tittle{stroke-dasharray:1 1;stroke-dashoffset:1;animation:gq-tittle .18s ease-out ${PEN_SECONDS + 0.12}s both}
.gq-settle{opacity:0;animation:gq-settle .3s ease-out ${PEN_SECONDS + 0.3}s both}
@keyframes gq-write{${PEN_KEYFRAMES}}
@keyframes gq-tittle{to{stroke-dashoffset:0}}
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
          <path
            className="gq-pen"
            d={PEN}
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeWidth={34}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="gq-tittle"
            d={TITTLE}
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeWidth={34}
            strokeLinecap="round"
          />
          <rect
            className="gq-settle"
            width="1720"
            height="524"
            fill="#fff"
          />
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
