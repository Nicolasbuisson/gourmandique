import { GourmandiqueWordmark } from "components/gourmandique-wordmark";

export function HomeHero() {
  // use public\images\GourmandiqueConnector.jpg to generate svg as one stroke?
  // see if can remove the connector between 'G' and 'o' from crossing past the 'G'
  // or we have no connector public\images\Gourmandique.jpg

  // CHECK CLAUDE CONVO HISTORY
  // FIX CROSSING STUBS
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
