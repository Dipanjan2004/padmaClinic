"use client";

import { ArrowRight } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import type { PublicDoctor } from "@/features/website-content/types";
import { toMinutes, useClinicNow, type Weekday } from "@/lib/clinic-time";
import { TodayPanel } from "./TodayPanel";
import { WEEK_ORDER, bookPath, dayLong, dayShort, dictionary, formatTime, pick, type Lang } from "../i18n";

/** Pick a day and see who is in. Defaults to today once the browser knows what day it is. */
export function WeekTimetable({ lang, doctors }: { lang: Lang; doctors: PublicDoctor[] }) {
  const t = dictionary(lang);
  const now = useClinicNow();
  const [chosen, setChosen] = useState<Weekday | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const day: Weekday = chosen ?? now?.weekday ?? WEEK_ORDER[0];
  const index = WEEK_ORDER.indexOf(day);

  const entries = doctors
    .flatMap((doctor) =>
      doctor.sessions.filter((s) => s.weekday === day).map((session) => ({ doctor, session })),
    )
    .sort((a, b) => toMinutes(a.session.start) - toMinutes(b.session.start));

  const busyDays = new Set(doctors.flatMap((d) => d.sessions.map((s) => s.weekday)));

  function onKeyDown(event: KeyboardEvent) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + WEEK_ORDER.length) % WEEK_ORDER.length;
    setChosen(WEEK_ORDER[next]);
    tabRefs.current[next]?.focus();
  }

  return (
    <section
      id="timings"
      className="mx-auto max-w-6xl px-4 py-10 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] md:gap-14 md:px-6 md:py-16"
    >
      <div>
        <h2 className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">{t.week.title}</h2>
        <p className="mt-2 text-ink-muted">{t.week.note}</p>
        <div className="mt-6">
          <TodayPanel lang={lang} doctors={doctors} />
        </div>
      </div>

      <div>
        <div
          role="tablist"
          aria-label={t.week.tabs}
          onKeyDown={onKeyDown}
          className="relative mt-6 grid grid-cols-7 gap-1 rounded-2xl border border-line bg-surface p-1 md:mt-0"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-1 left-1 w-[calc((100%-2rem)/7)] rounded-xl bg-brand shadow-sm transition-transform duration-300 ease-out-expo motion-reduce:transition-none"
            style={{ transform: `translateX(calc(${index} * (100% + 0.25rem)))` }}
          />
          {WEEK_ORDER.map((weekday, i) => {
            const selected = weekday === day;
            const isToday = weekday === now?.weekday;
            return (
              <button
                key={weekday}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`day-tab-${weekday}`}
                aria-selected={selected}
                aria-controls="day-panel"
                aria-label={dayLong(lang, weekday)}
                tabIndex={selected ? 0 : -1}
                onClick={() => setChosen(weekday)}
                className={`relative z-10 flex h-14 flex-col items-center justify-center rounded-xl text-[0.9rem] font-medium transition-colors duration-200 ${
                  selected
                    ? "text-white"
                    : busyDays.has(weekday)
                      ? "text-ink hover:bg-mist"
                      : "text-ink-muted/70 hover:bg-mist"
                }`}
              >
                {dayShort(lang, weekday)}
                <span
                  aria-hidden="true"
                  className={`mt-1 h-1 w-1 rounded-full ${
                    isToday ? (selected ? "bg-white" : "bg-brand") : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div
          id="day-panel"
          role="tabpanel"
          aria-labelledby={`day-tab-${day}`}
          key={day}
          className="list-settle mt-4"
        >
          {entries.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line px-4 py-8 text-center text-ink-muted">
              {t.week.empty}
            </p>
          ) : (
            <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
              {entries.map(({ doctor, session }) => {
                const name = pick(lang, doctor.name);
                return (
                  <li key={`${doctor.slug}-${session.start}`} className="flex items-center gap-4 px-4 py-4">
                    <p className="w-28 shrink-0 font-display text-lg leading-tight font-semibold tabular-nums">
                      {formatTime(lang, session.start)}
                      <span className="mt-0.5 block font-sans text-sm font-normal text-ink-muted">
                        {t.week.until(formatTime(lang, session.end))}
                      </span>
                    </p>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{name}</p>
                      {doctor.speciality && (
                        <p className="text-sm text-ink-muted">{pick(lang, doctor.speciality)}</p>
                      )}
                    </div>
                    <a
                      href={bookPath(doctor.slug)}
                      aria-label={t.week.bookWith(name)}
                      className="press grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-soft text-brand hover:bg-brand hover:text-white"
                    >
                      <ArrowRight aria-hidden="true" className="h-5 w-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
