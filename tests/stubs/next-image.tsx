/**
 * Runtime stand-in for `next/image` in unit tests (aliased in vitest.config.mts).
 * TypeScript still typechecks callers against the real `next/image` types —
 * this only replaces what executes under jsdom.
 */
export default function Image(props: { src?: unknown; alt?: unknown }) {
  const raw = props.src;
  const src =
    typeof raw === "string"
      ? raw
      : raw && typeof raw === "object" && "src" in raw
        ? String((raw as { src: unknown }).src)
        : "";
  const alt = typeof props.alt === "string" ? props.alt : "";
  return <img src={src} alt={alt} />;
}
