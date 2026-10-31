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

/** A doctor's photo, or their initials until a photo is uploaded. */
export function Avatar({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft font-display text-sm font-semibold text-brand"
    >
      {initials(name)}
    </span>
  );
}
