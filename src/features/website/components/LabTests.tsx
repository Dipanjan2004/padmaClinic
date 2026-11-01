"use client";

import Image from "next/image";
import {
  Activity,
  ArrowUpRight,
  ClipboardCheck,
  Droplet,
  FlaskConical,
  HeartPulse,
  MessageCircle,
  Phone,
  Search,
  TestTubes,
  Thermometer,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import labImage from "@/assets/images/lab-tubes.jpg";
import type { LabIcon, Localized, PublicLabTests } from "@/features/website-content/types";
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
const TONE: Record<LabIcon, string> = {
  thermometer: "bg-sun-soft text-sun",
  droplet: "bg-brand-soft text-brand",
  activity: "bg-ok-soft text-ok",
  "heart-pulse": "bg-sun-soft text-sun",
  flask: "bg-ok-soft text-ok",
  "test-tubes": "bg-brand-soft text-brand",
};

// Words people add to a search that say nothing about which test they mean.
const FILLER = new Set(["test", "tests", "টেস্ট", "পরীক্ষা"]);

const both = (text: Localized) => `${text.en} ${text.bn ?? ""}`.toLowerCase();

/**
 * Lab tests through the clinic's partner lab (D-032, D-042). Browsing shows every
 * test in a printed-style test menu, grouped by health concern. Searching, which is how most
 * people arrive (with the test their doctor named), lists the matches with what
 * each one checks; a search with no match becomes a WhatsApp question.
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

  const trimmed = query.trim();
  const words = trimmed
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word && !FILLER.has(word));
  const searching = words.length > 0;
  const matches = (haystack: string) => words.every((word) => haystack.includes(word));

  const results = searching
    ? categories.flatMap((category) =>
        category.tests
          .filter((test) => matches(`${both(test.name)} ${both(test.about)} ${both(category.name)}`))
          .map((test) => ({ category, test })),
      )
    : [];
  const checkupFound =
    searching &&
    checkup !== null &&
    matches(`${both(checkup.name)} ${both(checkup.about)} ${checkup.covers.map(both).join(" ")}`);
  const found = results.length + (checkupFound ? 1 : 0);

  const covered =
    checkup &&
    new Intl.ListFormat(lang === "bn" ? "bn" : "en-GB", { type: "conjunction" }).format(
      checkup.covers.map((item) => (lang === "bn" ? pick(lang, item) : item.en.toLowerCase())),
    );

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
                className="h-14 w-full rounded-full border border-line bg-surface pr-12 pl-12 text-[1.0625rem] shadow-sm outline-none placeholder:text-ink-muted/80 focus:border-brand focus:ring-4 focus:ring-brand/15 [&::-webkit-search-cancel-button]:appearance-none"
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

          <p aria-live="polite" className="sr-only">
            {searching ? t.labs.found(found) : ""}
          </p>

          {searching ? (
            // Search results: each match with what it checks.
            <div className="list-settle mt-8 rounded-[1.5rem] bg-surface p-2">
              {found > 0 ? (
                <ul className="divide-y divide-line">
                  {checkupFound && checkup && (
                    <ResultRow
                      icon={ClipboardCheck}
                      tone="bg-brand text-white"
                      name={pick(lang, checkup.name)}
                      about={pick(lang, checkup.about)}
                      group={t.labs.checkupTag}
                    />
                  )}
                  {results.map(({ category, test }) => (
                    <ResultRow
                      key={test.name.en}
                      icon={ICONS[category.icon]}
                      tone={TONE[category.icon]}
                      name={pick(lang, test.name)}
                      about={pick(lang, test.about)}
                      group={pick(lang, category.name)}
                    />
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-start gap-4 p-4 md:p-6">
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
                      onClick={() => setQuery("")}
                      className="press inline-flex h-12 items-center gap-2 rounded-full border border-line px-5 font-medium hover:border-ink/30"
                    >
                      <X aria-hidden="true" className="h-4 w-4" />
                      {t.labs.clear}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Browsing: the full body checkup beside a test menu, the way labs print one. Categories flow
            // in balanced columns at their natural height, so no card is left half empty.
            <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              {checkup && (
                <article className="group flex flex-col overflow-hidden rounded-[1.5rem] bg-brand text-white md:flex-row lg:flex-col">
                  <div className="relative h-44 shrink-0 overflow-hidden md:h-auto md:min-h-64 md:w-1/2 lg:h-auto lg:min-h-48 lg:w-auto lg:flex-1">
                    <Image
                      src={labImage}
                      alt=""
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105 motion-reduce:transition-none"
                    />
                    <span className="absolute top-4 left-4 rounded-full bg-lime px-3 py-1 text-sm font-semibold text-ink">
                      {t.labs.checkupTag}
                    </span>
                  </div>
                  <div className="flex flex-col p-6 md:w-1/2 md:justify-center md:p-7 lg:w-auto">
                    <h3 className="font-display text-[1.75rem] leading-[1.1] font-medium tracking-[-0.03em] md:text-3xl [:lang(bn)_&]:leading-[1.3] [:lang(bn)_&]:tracking-normal">
                      {pick(lang, checkup.name)}
                    </h3>
                    <p className="mt-3 text-white/85">
                      {pick(lang, checkup.about)} {covered && t.labs.covers(covered)}
                    </p>
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
                  </div>
                </article>
              )}

              <div className="rounded-[1.5rem] bg-surface p-6 md:p-8">
                <div className="gap-10 sm:columns-2 [column-rule:1px_solid_var(--color-line)]">
                  {categories.map((category) => {
                    const Icon = ICONS[category.icon];
                    return (
                      <section key={category.id} className="mb-7 break-inside-avoid">
                        <h3 className="flex items-center gap-2.5 font-display text-lg font-semibold [:lang(bn)_&]:tracking-normal">
                          <span
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${TONE[category.icon]}`}
                          >
                            <Icon aria-hidden="true" className="h-4 w-4" />
                          </span>
                          {pick(lang, category.name)}
                        </h3>
                        <ul className="mt-3 space-y-1.5 pl-[2.625rem] text-[0.95rem]">
                          {category.tests.map((test) => (
                            <li key={test.name.en}>{pick(lang, test.name)}</li>
                          ))}
                        </ul>
                      </section>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
                  <p className="max-w-md text-ink-muted">
                    <span className="font-semibold text-ink">{t.labs.moreTitle}</span> {t.labs.moreBody}
                  </p>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {whatsapp && (
                      <a
                        href={whatsappLink(whatsapp, t.labs.askMessage)}
                        className="press inline-flex h-12 items-center gap-2 rounded-full bg-brand px-5 font-medium text-white hover:bg-brand-strong"
                      >
                        <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                        {t.labs.ask}
                      </a>
                    )}
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="press inline-flex h-12 items-center gap-2 rounded-full border border-line px-5 font-medium hover:border-ink/30"
                      >
                        <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                        {t.actions.call}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ResultRow({
  icon: Icon,
  tone,
  name,
  about,
  group,
}: {
  icon: LucideIcon;
  tone: string;
  name: string;
  about: string;
  group: string;
}) {
  return (
    <li className="flex items-start gap-3 px-3 py-4 md:px-4">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}>
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">
          {name}
          <span className="ml-2 text-sm font-normal text-ink-muted">{group}</span>
        </p>
        <p className="mt-0.5 text-[0.95rem] text-ink-muted">{about}</p>
      </div>
    </li>
  );
}
