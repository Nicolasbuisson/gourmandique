import clsx from "clsx";
import Link from "next/link";

// A button, or a link that looks like one when given an `href`.
//
// On hover (and keyboard focus, and press) two things happen at once:
//
// - A curtain lifts off the button, as the home hero's curtain lifts off the
//   page. The curtain is an absolute layer in the resting background; the
//   button's own background beneath it is the hover one.
// - The label flips, as FlipLink's does: the resting label rises out of the
//   top of its line while a hover-coloured copy rises in from below. The line
//   clips them, so a label is only ever seen in its own line.
//
// Both use `ease-pen`, the curve the wordmark is written with.
//
// The resting label is in flow, so it sizes the button and is the one screen
// readers hear; the arriving copy is aria-hidden. `overflow-hidden` on the
// button clips the curtain as it leaves; the border sits outside both and
// stays put.

type ButtonProps = {
  text: string;
  onClick?: () => void;
  href?: string;
  style: "primary" | "secondary";
  className?: string;
};

const BASE =
  "group relative inline-flex items-center justify-center overflow-hidden border-3 border-accent px-6 py-3 text-sm font-medium uppercase";

const MOVE =
  "transition-transform duration-300 ease-pen motion-reduce:transition-none";

const LIFT =
  "group-hover:-translate-y-full group-focus-visible:-translate-y-full group-active:-translate-y-full";

const CURTAIN = clsx("absolute inset-0", MOVE, LIFT);

const LEAVING = clsx("block", MOVE, LIFT);

const ARRIVING = clsx(
  "absolute inset-0 translate-y-full",
  MOVE,
  "group-hover:translate-y-0 group-focus-visible:translate-y-0 group-active:translate-y-0",
);

// Each style hovers to the other's resting look.
const STYLES = {
  primary: {
    rest: { bg: "bg-accent", text: "text-on-accent" },
    hover: { bg: "bg-surface", text: "text-accent" },
  },
  secondary: {
    rest: { bg: "bg-surface", text: "text-accent" },
    hover: { bg: "bg-accent", text: "text-on-accent" },
  },
} as const;

export function Button({ text, onClick, href, style, className }: ButtonProps) {
  const { rest, hover } = STYLES[style];
  const classes = clsx(BASE, hover.bg, className);
  const content = (
    <>
      <span aria-hidden className={clsx(CURTAIN, rest.bg)} />
      <span className="relative overflow-hidden whitespace-nowrap">
        <span className={clsx(LEAVING, rest.text)}>{text}</span>
        <span aria-hidden className={clsx(ARRIVING, hover.text)}>
          {text}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
