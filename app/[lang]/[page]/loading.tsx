// The `[page]` handle is only known at request time, so with Cache Components
// the page streams in behind this boundary while the shell is prerendered.
//
// TODO: placeholder skeleton. Make it match the content page's real layout
// (title, body copy, "last updated" line) once that design is settled.
export default function Loading() {
  return (
    <div
      aria-hidden
      className="h-96 w-full animate-pulse rounded-card bg-surface-sunken"
    />
  );
}
