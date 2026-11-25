"use client";

import en from "dictionaries/en.json";
import fr from "dictionaries/fr.json";
import { useLocale } from "lib/use-locale";

// Error boundaries are client components and can't load the dictionary
// themselves, so this one imports just the `error` copy for both locales.
const COPY = { en: en.error, fr: fr.error };

export default function Error({ reset }: { reset: () => void }) {
  const copy = COPY[useLocale()];

  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12">
      <h2 className="text-xl font-bold">{copy.title}</h2>
      <p className="my-2">{copy.body}</p>
      <button
        className="mx-auto mt-4 flex w-full items-center justify-center rounded-full bg-accent p-4 tracking-wide text-on-accent hover:opacity-90"
        onClick={() => reset()}
      >
        {copy.retry}
      </button>
    </div>
  );
}
