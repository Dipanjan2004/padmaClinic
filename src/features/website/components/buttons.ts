// Shared button looks for links and buttons on the public site.

const base =
  "press inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap [&_svg]:shrink-0";

export const buttonPrimary = `${base} h-12 bg-brand px-6 text-white hover:bg-brand-strong`;

export const buttonSecondary = `${base} h-12 border border-line bg-surface px-5 text-ink hover:border-ink/30`;
