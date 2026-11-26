// The product handle is only known at request time, so with Cache Components
// the page streams in behind this boundary while the shell is prerendered.
//
// TODO: placeholder skeleton. Make it match the product page's real layout
// (gallery, description, related products) once that design is settled.
export default function Loading() {
  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4">
      <div
        aria-hidden
        className="aspect-square w-full animate-pulse rounded-card bg-surface-sunken lg:aspect-[2/1]"
      />
    </div>
  );
}
