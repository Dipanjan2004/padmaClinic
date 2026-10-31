"use client";

import Image from "next/image";
import {
  Activity,
  ArrowUpRight,
  Droplet,
  FlaskConical,
  HeartPulse,
  MessageCircle,
  Phone,
  Pointer,
  Search,
  TestTubes,
  Thermometer,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import labImage from "@/assets/images/lab-tubes.jpg";
import type { LabCategory, LabIcon, Localized, PublicLabTests } from "@/features/website-content/types";
import { dictionary, pick, whatsappLink, type Lang } from "../i18n";

const ICONS: Record<LabIcon, LucideIcon> = {
  thermometer: Thermometer,
  droplet: Droplet,
  activity: Activity,
  "heart-pulse": HeartPulse,
  flask: FlaskConical,
  "test-tubes": TestTubes,
};

// Each concern gets one of the palette's tints, so the tiles are easy to tell apart.
const TONES = {
  sun: { badge: "bg-sun-soft text-sun", picked: "border-sun bg-sun text-white" },
  brand: { badge: "bg-brand-soft text-brand", picked: "border-brand bg-brand text-white" },
  ok: { badge: "bg-ok-soft text-ok", picked: "border-ok bg-ok text-white" },
};
const TONE_BY_ICON: Record<LabIcon, keyof typeof TONES> = {
  thermometer: "sun",
  droplet: "brand",
  activity: "ok",
  "heart-pulse": "sun",
  flask: "ok",
  "test-tubes": "brand",
};

// Words people add to a search that say nothing about which test they mean.
const FILLER = new Set(["test", "tests", "টেস্ট", "পরীক্ষা"]);

const both = (text: Localized) => `${text.en} ${text.bn ?? ""}`.toLowerCase();

/**
 * Lab tests through the clinic's partner lab (D-032, D-034). People usually arrive
 * knowing the test their doctor named, so there is a search box; they can also
 * filter by health concern. Every test is visible at once as a pill, and tapping
 * one says what it checks. A search with no match becomes a WhatsApp question.
 */
export function LabTests({
  lang,
  labTests,
  whatsapp,
  phone,
}: {
  lang: Lang;
  labTests: PublicLabTests;
  whatsapp: string | null;
  phone: string | null;
}) {
  const t = dictionary(lang);
  const { categories, checkup } = labTests;
  const [query, setQuery] = useState("");
  const [concern, setConcern] = useState("all");
  const [picked, setPicked] = useState<Record<string, string | undefined>>({});

  const trimmed = query.trim();
  const words = trimmed
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word && !FILLER.has(word));
  const matches = (haystack: string) => words.every((word) => haystack.includes(word));

  const tiles = categories
    .filter((category) => concern === "all" || category.id === concern)
    .map((category) => {
      const inCategory = both(category.name);
      const tests = category.tests.filter((test) =>
        matches(`${both(test.name)} ${both(test.about)} ${inCategory}`),
      );
      return { category, tests };
    })
    .filter((tile) => tile.tests.length > 0);

  const showCheckup =
    checkup !== null &&
    concern === "all" &&
    matches(`${both(checkup.name)} ${both(checkup.about)} ${checkup.covers.map(both).join(" ")}`);
  const found = tiles.reduce((sum, tile) => sum + tile.tests.length, 0) + (showCheckup ? 1 : 0);
  const nothing = found === 0;

  return (
    <section id="lab-tests" className="px-3 py-6 md:px-4 md:py-10">
      <div className="rounded-[1.75rem] bg-mist md:rounded-[2.25rem]">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-sm font-medium shadow-sm">
                <FlaskConical aria-hidden="true" className="h-4 w-4 text-brand" />
                {t.labs.partner(pick(lang, labTests.partner))}
              </span>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.025em] md:text-5xl [:lang(bn)_&]:tracking-normal">
                {t.labs.title}
              </h2>
              <p className="mt-3 max-w-md text-ink-muted md:text-lg">{t.labs.intro}</p>
            </div>

            <div role="search" className="relative min-w-0">
              <label htmlFor="lab-search" className="sr-only">
                {t.labs.search}
              </label>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink-muted"
              />
              <input
                id="lab-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.labs.searchHint}
                autoComplete="off"
                enterKeyHint="search"
                className="h-14 w-full rounded-full border border-line bg-surface pr-12 pl-12 text-[1.0625rem] shadow-sm transition-shadow outline-none placeholder:text-ink-muted/80 focus:border-brand focus:ring-4 focus:ring-brand/15 [&::-webkit-search-cancel-button]:appearance-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label={t.labs.clear}
                  className="press absolute top-1/2 right-2.5 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink-muted hover:bg-mist hover:text-ink"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Concern filters wrap onto as many lines as they need, so every one is always visible. */}
          <div role="group" aria-label={t.labs.filters} className="mt-6">
            <div className="flex flex-wrap gap-2">
              <ConcernChip active={concern === "all"} onClick={() => setConcern("all")}>
                {t.labs.all}
              </ConcernChip>
              {categories.map((category) => {
                const Icon = ICONS[category.icon];
                const tone = TONES[TONE_BY_ICON[category.icon]];
                const active = concern === category.id;
                return (
                  <ConcernChip key={category.id} active={active} onClick={() => setConcern(category.id)}>
                    <Icon
                      aria-hidden="true"
                      className={`h-4 w-4 ${active ? "text-white" : tone.badge.split(" ")[1]}`}
                    />
                    {pick(lang, category.name)}
                  </ConcernChip>
                );
              })}
            </div>
          </div>

          <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
            <Pointer aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
            {t.labs.tapHint}
          </p>
          <p aria-live="polite" className="sr-only">
            {t.labs.found(found)}
          </p>

          <div key={concern} className="mt-5 grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {showCheckup && checkup && (
              <article className="list-settle group relative isolate flex flex-col md:min-h-[22rem] overflow-hidden rounded-[1.5rem] bg-brand p-6 text-white md:col-span-2 md:p-7 lg:col-span-1 lg:row-span-2">
                <Image
                  src={labImage}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 380px, 100vw"
                  className="-z-20 object-cover object-[50%_40%] opacity-40 mix-blend-luminosity transition-transform duration-700 ease-out-expo group-hover:scale-105 motion-reduce:transition-none"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(36_99_166/0.35)_0%,var(--color-brand)_62%)]"
                />
                <span className="self-start rounded-full bg-lime px-3 py-1 text-sm font-semibold text-ink">
                  {t.labs.checkupTag}
                </span>
                <h3 className="mt-auto pt-10 font-display md:pt-16 text-[2rem] leading-[1.05] font-medium tracking-[-0.03em] md:text-4xl [:lang(bn)_&]:leading-[1.25] [:lang(bn)_&]:tracking-normal">
                  {pick(lang, checkup.name)}
                </h3>
                <p className="mt-2 text-white/85">{pick(lang, checkup.about)}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {checkup.covers.map((item) => (
                    <li
                      key={item.en}
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-medium"
                    >
                      {pick(lang, item)}
                    </li>
                  ))}
                </ul>
                {whatsapp && (
                  <a
                    href={whatsappLink(whatsapp, t.labs.checkupMessage)}
                    className="press group/ask mt-6 inline-flex h-12 items-center gap-2 self-start rounded-full bg-white pr-1.5 pl-5 font-medium text-ink hover:bg-white/90"
                  >
                    {t.labs.askCheckup}
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-lime">
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover/ask:rotate-45"
                      />
                    </span>
                  </a>
                )}
              </article>
            )}

            {tiles.map(({ category, tests }, i) => (
              <ConcernTile
                key={category.id}
                lang={lang}
                category={category}
                tests={tests}
                index={i}
                picked={picked[category.id]}
                onPick={(name) =>
                  setPicked((current) => ({
                    ...current,
                    [category.id]: name,
                  }))
                }
              />
            ))}

            {nothing ? (
              <article className="list-settle flex flex-col items-start gap-4 rounded-[1.5rem] bg-surface p-6 md:col-span-2 lg:col-span-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <Search aria-hidden="true" className="h-5 w-5" />
                </span>
                <p className="text-lg font-medium">{t.labs.noMatch(trimmed)}</p>
                <div className="flex flex-wrap gap-2">
                  {whatsapp && (
                    <a
                      href={whatsappLink(whatsapp, t.labs.askQueryMessage(trimmed))}
                      className="press inline-flex h-12 items-center gap-2 rounded-full bg-brand px-5 font-medium text-white hover:bg-brand-strong"
                    >
                      <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {t.labs.askAbout(trimmed)}
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setConcern("all");
                    }}
                    className="press inline-flex h-12 items-center gap-2 rounded-full border border-line px-5 font-medium hover:border-ink/30"
                  >
                    <X aria-hidden="true" className="h-4 w-4" />
                    {t.labs.clear}
                  </button>
                </div>
              </article>
            ) : (
              <article className="list-settle flex flex-col rounded-[1.5rem] bg-lime p-6 text-ink md:col-span-2 md:p-7 lg:col-span-1">
                <h3 className="font-display text-[1.75rem] leading-[1.1] font-medium tracking-[-0.03em] [:lang(bn)_&]:leading-[1.3] [:lang(bn)_&]:tracking-normal">
                  {t.labs.moreTitle}
                </h3>
                <p className="mt-2 text-ink/80">{t.labs.moreBody}</p>
                <div className="mt-auto grid gap-2 pt-6 sm:flex sm:flex-wrap">
                  {whatsapp && (
                    <a
                      href={whatsappLink(whatsapp, t.labs.askMessage)}
                      className="press inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 font-medium text-white hover:bg-ink/90"
                    >
                      <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {t.labs.ask}
                    </a>
                  )}
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="press inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/20 px-5 font-medium hover:bg-ink/5"
                    >
                      <Phone aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {t.actions.call}
                    </a>
                  )}
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ConcernChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`press inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200 md:px-4 ${
        active ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink hover:border-ink/30"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * One health concern: its tests as pills, one always picked and explained underneath.
 * Every explanation sits in the same spot and only the picked one shows, so the
 * tile is always as tall as its longest explanation and never changes size.
 */
function ConcernTile({
  lang,
  category,
  tests,
  index,
  picked,
  onPick,
}: {
  lang: Lang;
  category: LabCategory;
  tests: LabCategory["tests"];
  index: number;
  picked: string | undefined;
  onPick: (name: string) => void;
}) {
  const t = dictionary(lang);
  const Icon = ICONS[category.icon];
  const tone = TONES[TONE_BY_ICON[category.icon]];
  const current = tests.find((test) => test.name.en === picked) ?? tests[0];
  const captionId = `lab-caption-${category.id}`;

  return (
    <article
      className="list-settle flex flex-col rounded-[1.5rem] bg-surface p-5 md:p-6"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-center gap-3">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${tone.badge}`}>
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-tight font-medium tracking-[-0.02em] md:text-2xl [:lang(bn)_&]:tracking-normal">
            {pick(lang, category.name)}
          </h3>
          <p className="text-sm text-ink-muted">{t.labs.count(tests.length)}</p>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {tests.map((test) => {
          const active = test.name.en === current.name.en;
          return (
            <li key={test.name.en}>
              <button
                type="button"
                aria-pressed={active}
                aria-controls={captionId}
                onClick={() => onPick(test.name.en)}
                className={`press inline-flex min-h-11 items-center rounded-full border px-3.5 py-1.5 text-left text-[0.95rem] font-medium transition-colors duration-200 ${
                  active ? tone.picked : "border-line bg-surface hover:border-ink/30"
                }`}
              >
                {pick(lang, test.name)}
              </button>
            </li>
          );
        })}
      </ul>

      <div id={captionId} className="mt-auto pt-4">
        <div className="grid rounded-xl bg-mist px-3.5 py-3 text-[0.95rem] text-ink-muted">
          {tests.map((test) => {
            const shown = test.name.en === current.name.en;
            return (
              <p
                key={test.name.en}
                aria-hidden="true"
                className={`col-start-1 row-start-1 transition-[opacity,visibility] duration-200 ${
                  shown ? "visible opacity-100" : "invisible opacity-0"
                }`}
              >
                <span className="font-semibold text-ink">{pick(lang, test.name)}:</span>{" "}
                {pick(lang, test.about)}
              </p>
            );
          })}
        </div>
        <p aria-live="polite" className="sr-only">
          {pick(lang, current.name)}: {pick(lang, current.about)}
        </p>
      </div>
    </article>
  );
}
