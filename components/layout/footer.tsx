import { FlipLink } from "components/fliplink/flipLink";
import { GourmandiqueWordmarkStatic } from "components/gourmandique-wordmark";

const links = [
  { title: "Home", path: "/" },
  { title: "Shop", path: "/shop" },
  { title: "Wedding", path: "/wedding" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

// The footer is revealed, not scrolled in: the page lifts off it like a
// curtain. The outer box sits at the end of the flow, exactly --footer-h tall,
// and clip-path cuts everything inside it to that box. The inner box starts one
// screen above it, which gives the footer room to stick to the bottom of the
// window while the outer box scrolls in. Nothing above the footer needs to know
// about any of this.
//
// clip-path, not overflow-hidden: overflow on an ancestor turns off sticky.
// Sticky, not fixed: a fixed footer is always inside the window, so tabbing to
// a link would focus it unseen instead of scrolling to it.
export default function Footer() {
  return (
    <div className="relative h-(--footer-h) [clip-path:inset(0)]">
      <div className="relative -top-[100svh] h-[calc(100svh+var(--footer-h))]">
        <footer className="sticky top-[calc(100svh-var(--footer-h))] flex h-(--footer-h) flex-col overflow-hidden text-sm text-ink-muted">
          <nav
            aria-label="Footer"
            className="mx-auto w-full max-w-7xl shrink-0 px-6 py-12"
          >
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {links.map((link) => (
                <li key={link.path}>
                  <FlipLink
                    href={link.path}
                    label={link.title}
                    className="text-h4 uppercase"
                  />
                </li>
              ))}
            </ul>
          </nav>
          {/* Takes whatever height --footer-h leaves, and the wordmark shrinks
              to fit it, so a short window squeezes the mark, not the links. */}
          <div className="mx-auto flex min-h-0 w-full flex-1 items-center px-6 sm:max-w-[50%]">
            <GourmandiqueWordmarkStatic className="max-h-full w-full text-accent" />
          </div>
          <div className="mx-auto w-full max-w-7xl shrink-0 px-6 pt-6 pb-6">
            <p>&copy;2026</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
