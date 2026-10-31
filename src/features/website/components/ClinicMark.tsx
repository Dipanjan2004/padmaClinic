/**
 * Stand-in logo until the clinic supplies its own: a medical plus in a rounded square.
 * `inverse` is for coloured backgrounds (white square, blue plus).
 */
export function ClinicMark({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="9" fill={inverse ? "#fff" : "var(--color-brand)"} />
      <path d="M13.5 8.5h5v5h5v5h-5v5h-5v-5h-5v-5h5z" fill={inverse ? "var(--color-brand)" : "#fff"} />
    </svg>
  );
}
