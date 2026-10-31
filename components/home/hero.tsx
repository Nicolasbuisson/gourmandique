import { GourmandiqueWordmark } from "components/gourmandique-wordmark";

export function HomeHero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="flex h-dvh min-h-[32rem] w-full items-center justify-center bg-accent"
    >
      {/* The mark is artwork, not text, so the accessible name lives here. */}
      <h1 id="hero-title" className="sr-only">
        Gourmandique
      </h1>
      <GourmandiqueWordmark className="h-auto w-[min(88vw,64rem)] text-on-accent" />
    </section>
  );
}
