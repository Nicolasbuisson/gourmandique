import { GourmandiqueWordmark } from "components/gourmandique-wordmark";

// The home hero: a full-viewport plate of the brand ink with nothing on it but
// the wordmark. `h-dvh` rather than `h-screen` so mobile browser chrome
// collapsing doesn't leave the section taller than the viewport.
export function HomeHero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex h-dvh min-h-[32rem] w-full items-center justify-center bg-accent px-6"
    >
      {/* The wordmark is drawn, not set, so the accessible name lives here. */}
      <h1 id="hero-title" className="sr-only">
        Gourmandique
      </h1>
      <GourmandiqueWordmark className="w-full max-w-5xl text-on-accent" />
    </section>
  );
}
