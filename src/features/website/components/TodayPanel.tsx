"use client";

import { ArrowRight } from "lucide-react";
import type { PublicDoctor } from "@/features/website-content/types";
import { toMinutes, useClinicNow, type ClinicNow } from "@/lib/clinic-time";
import { dayLong, dictionary, formatTimeRange, pick, type Lang } from "../i18n";
import { Avatar } from "./Avatar";

type Status = "live" | "later" | "done";

function statusAt(now: ClinicNow, start: string, end: string): Status {
  if (now.minutes < toMinutes(start)) return "later";
  if (now.minutes < toMinutes(end)) return "live";
  return "done";
}

const STATUS_STYLE: Record<Status, string> = {
  live: "bg-ok-soft text-ok",
  later: "bg-sun-soft text-sun",
  done: "bg-mist text-ink-muted",
};

/** "Who is in today", worked out in the browser from the clinic's clock. */
export function TodayPanel({ lang, doctors }: { lang: Lang; doctors: PublicDoctor[] }) {
  const t = dictionary(lang);
  const now = useClinicNow();

  const rows = now
    ? doctors
        .flatMap((doctor) =>
          doctor.sessions
            .filter((session) => session.weekday === now.weekday)
            .map((session) => ({ doctor, session, status: statusAt(now, session.start, session.end) })),
        )
        .sort((a, b) => toMinutes(a.session.start) - toMinutes(b.session.start))
    : [];

  return (
    <aside
      aria-labelledby="today-title"
      aria-busy={now === null}
      className="rounded-3xl border border-line bg-surface p-5 md:p-6"
    >
      <h2 id="today-title" className="font-display text-xl font-semibold">
        {t.today.title}
        {now && <span className="font-normal text-ink-muted"> · {dayLong(lang, now.weekday)}</span>}
      </h2>

      {now === null ? (
        <div className="mt-4 space-y-3" aria-label={t.today.loading}>
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <span className="h-10 w-10 rounded-full bg-line/70 motion-safe:animate-pulse" />
              <span className="h-4 flex-1 rounded-full bg-line/70 motion-safe:animate-pulse" />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="mt-4 text-ink-muted">{t.today.none}</p>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {rows.map(({ doctor, session, status }) => (
            <li key={`${doctor.slug}-${session.start}`} className="flex items-center gap-3 py-3">
              <Avatar name={doctor.name.en} photoUrl={doctor.photoUrl} />
              <div className="min-w-0 flex-1">
                <p className={`truncate font-medium ${status === "done" ? "text-ink-muted" : ""}`}>
                  {pick(lang, doctor.name)}
                </p>
                <p className="text-sm text-ink-muted tabular-nums">
                  {formatTimeRange(lang, session.start, session.end)}
                </p>
              </div>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium ${STATUS_STYLE[status]}`}
              >
                {status === "live" && <span className="live-dot h-2 w-2 rounded-full bg-current" />}
                {t.today[status]}
              </span>
            </li>
          ))}
        </ul>
      )}

      <a
        href="#timings"
        className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand"
      >
        {t.today.seeWeek}
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </a>
    </aside>
  );
}
