import { FlipLink } from "components/fliplink/flipLink";
import { GourmandiqueWordmarkStatic } from "components/gourmandique-wordmark";

const links = [
  { title: "Home", path: "/" },
  { title: "Shop", path: "/shop" },
  { title: "Wedding", path: "/wedding" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden text-sm text-ink-muted">
      <nav aria-label="Footer" className="mx-auto w-full max-w-7xl px-6 py-12">
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
      <div className="mx-auto w-full sm:max-w-[50%] px-6 py-12">
        <GourmandiqueWordmarkStatic className="h-auto w-full text-accent" />
      </div>
      <div className="mx-auto w-full max-w-7xl px-6 pb-6">
        <p>&copy;2026</p>
      </div>
    </footer>
  );
}
