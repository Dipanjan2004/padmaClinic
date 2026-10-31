import { useSyncExternalStore } from "react";

/** 0 = Sunday … 6 = Saturday, matching `Date.prototype.getDay`. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** `date` is the clinic's calendar date, "YYYY-MM-DD". */
export type ClinicNow = { date: string; weekday: Weekday; minutes: number };

const WEEKDAY_INDEX: Record<string, Weekday> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const clinicClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** "2026-11-01" + 1 → "2026-11-02". Works on calendar dates, so time zones don't matter. */
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** "18:30" → 1110 */
export function toMinutes(hhmm: string): number {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return hours * 60 + minutes;
}

function readClinicNow(): ClinicNow {
  const parts = Object.fromEntries(
    clinicClock.formatToParts(new Date()).map((part) => [part.type, part.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    weekday: WEEKDAY_INDEX[parts.weekday],
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

let snapshot: ClinicNow | null = null;

function getSnapshot(): ClinicNow {
  const next = readClinicNow();
  if (!snapshot || snapshot.weekday !== next.weekday || snapshot.minutes !== next.minutes) {
    snapshot = next;
  }
  return snapshot;
}

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 20_000);
  // Phones pause background tabs; catch up as soon as the page is visible again.
  document.addEventListener("visibilitychange", onChange);
  return () => {
    clearInterval(timer);
    document.removeEventListener("visibilitychange", onChange);
  };
}

/**
 * The current day and time at the clinic (Asia/Kolkata). It is `null` during
 * server rendering, because "now" is only known in the browser and pages are
 * prerendered.
 */
export function useClinicNow(): ClinicNow | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
