import Image from "next/image";

export function initials(name: string): string {
  return name
    .replace(/^Dr\.?\s*/i, "")
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(-2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

const SIZES = {
  sm: { box: "h-10 w-10 text-sm", px: 40 },
  lg: { box: "h-16 w-16 text-xl", px: 64 },
};

/** A doctor's photo, or their initials until a photo is uploaded. */
export function Avatar({
  name,
  photoUrl,
  size = "sm",
}: {
  name: string;
  photoUrl: string | null;
  size?: keyof typeof SIZES;
}) {
  const { box, px } = SIZES[size];
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt=""
        width={px}
        height={px}
        className={`${box} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${box} grid shrink-0 place-items-center rounded-full bg-brand-soft font-display font-semibold text-brand`}
    >
      {initials(name)}
    </span>
  );
}
