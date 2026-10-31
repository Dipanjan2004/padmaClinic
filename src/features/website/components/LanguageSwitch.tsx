import { Languages } from "lucide-react";
import { dictionary, type Lang } from "../i18n";

const TONES = {
  light: "border-line bg-surface text-ink hover:border-ink/30",
  dark: "border-white/25 bg-white/5 text-white hover:bg-white/10",
};

export function LanguageSwitch({
  lang,
  tone = "light",
  compact = false,
  className = "",
}: {
  lang: Lang;
  tone?: keyof typeof TONES;
  /** Drops the icon on phones narrower than 400px, where the navbar is tight. */
  compact?: boolean;
  className?: string;
}) {
  const { switchTo } = dictionary(lang);
  // Each language has its own root layout, so this is a full page load by design.
  return (
    <a
      href={switchTo.href}
      hrefLang={switchTo.lang}
      lang={switchTo.lang}
      aria-label={switchTo.aria}
      className={`press inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border text-sm font-medium ${compact ? "px-3 min-[400px]:px-3.5" : "px-3.5"} ${TONES[tone]} ${className}`}
    >
      <Languages
        aria-hidden="true"
        className={`h-4 w-4 ${compact ? "max-[399px]:hidden" : ""} ${tone === "light" ? "text-brand" : "text-white/80"}`}
      />
      {switchTo.label}
    </a>
  );
}
