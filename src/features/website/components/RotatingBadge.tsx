import { ArrowUpRight } from "lucide-react";

/**
 * Round lime "Book" badge whose ring of text turns slowly (D-025, after the SmileLab reference).
 * It is a link to the booking card; the spin stops under reduced motion.
 * The caller positions it (pass `absolute` or `relative` in className).
 */
export function RotatingBadge({
  text,
  label,
  href,
  bengali = false,
  className = "",
}: {
  text: string;
  label: string;
  href: string;
  /** Bengali clusters break apart with letter-spacing, so they get plain spacing. */
  bengali?: boolean;
  className?: string;
}) {
  // Repeat the phrase so it fills the ring.
  const ring = `${text} • ${text} • `;
  return (
    <a
      href={href}
      aria-label={label}
      className={`press group grid aspect-square place-items-center rounded-full bg-lime text-ink shadow-panel ${className}`}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" className="badge-spin absolute inset-0 h-full w-full">
        <defs>
          <path id="badge-ring" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0" />
        </defs>
        {bengali ? (
          <text className="fill-current text-[11.8px] font-semibold">
            <textPath href="#badge-ring">{ring}</textPath>
          </text>
        ) : (
          <text className="fill-current text-[9.2px] font-semibold tracking-[0.12em] uppercase">
            <textPath href="#badge-ring" textLength="230" lengthAdjust="spacing">
              {ring}
            </textPath>
          </text>
        )}
      </svg>
      <ArrowUpRight
        aria-hidden="true"
        strokeWidth={1.75}
        className="h-[34%] w-[34%] transition-transform duration-300 ease-out-expo group-hover:rotate-45"
      />
    </a>
  );
}
