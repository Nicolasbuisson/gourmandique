// The route param is only known at request time, so with Cache Components
// the page streams in behind this boundary while the shell is prerendered.
export default function Loading() {
  return null;
}
