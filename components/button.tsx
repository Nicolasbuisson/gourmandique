import clsx from "clsx";
import Link from "next/link";

// A button, or a link that looks like one when given an `href`.
//
// On hover (and keyboard focus, and press) a curtain lifts off the button, as
// the home hero's curtain lifts off the page. The curtain is the resting look:
// an absolute layer over the whole button, carrying its own copy of the label.
// Beneath it, in flow, is the hover look; its label is the one that sizes the
// button and the one screen readers hear, so the curtain's copy is aria-hidden.
//
// Because the curtain carries its label up with it, the text changes colour
// exactly at the curtain's edge, which a colour transition couldn't do.
// `overflow-hidden` clips the curtain as it leaves; the border sits outside
// both and stays put.
//
// The lift uses `ease-pen`, the same curve the wordmark is written with.

type ButtonProps = {
  text: string;
  onClick?: () => void;
  href?: string;
  style: "primary" | "secondary";
  className?: string;
};

const BASE =
  "group relative inline-flex items-center justify-center overflow-hidden border-3 border-accent px-6 py-3 text-sm font-medium";

const CURTAIN =
  "absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-pen " +
  "group-hover:-translate-y-full group-focus-visible:-translate-y-full group-active:-translate-y-full " +
  "motion-reduce:transition-none";

// Each style hovers to the other's resting look.
const STYLES = {
  primary: {
    revealed: "bg-surface text-accent",
    curtain: "bg-accent text-on-accent",
  },
  secondary: {
    revealed: "bg-accent text-on-accent",
    curtain: "bg-surface text-accent",
  },
} as const;

export function Button({ text, onClick, href, style, className }: ButtonProps) {
  const classes = clsx(BASE, STYLES[style].revealed, className);
  const label = (
    <>
      {text}
      <span aria-hidden className={clsx(CURTAIN, STYLES[style].curtain)}>
        {text}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {label}
    </button>
  );
}
