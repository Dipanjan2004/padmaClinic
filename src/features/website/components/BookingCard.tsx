"use client";

import { Check, MessageCircle, Pencil } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { addDays, useClinicNow } from "@/lib/clinic-time";
import { dictionary, formatPhone, whatsappLink, type Lang } from "../i18n";
import { Avatar } from "./Avatar";

type DoctorOption = { slug: string; name: string; nameEn: string; photoUrl: string | null };
type Field = "doctor" | "date" | "name" | "phone";

type Props = {
  lang: Lang;
  clinicName: string;
  doctors: DoctorOption[];
  /** E.164. Requests go here on WhatsApp until online booking has a database (D-026). */
  whatsapp: string;
};

/** Accepts "98303 37825", "+91 98303 37825", "098303…" and returns 10 digits, or null. */
function normaliseMobile(input: string): string | null {
  const digits = input.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

const fieldStyle =
  "h-12 w-full rounded-xl border bg-surface px-3.5 text-[1.0625rem] outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

/**
 * The page's main job: pick a doctor and a day, leave a name and number. It opens
 * WhatsApp with the request written out, and reception confirms the serial (BR-01).
 */
export function BookingCard({ lang, clinicName, doctors, whatsapp }: Props) {
  const t = dictionary(lang).booking;
  const now = useClinicNow();
  const [doctor, setDoctor] = useState(doctors.length === 1 ? doctors[0].slug : "");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sentLink, setSentLink] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // "#book:<slug>" links elsewhere on the page choose the doctor and bring the card into view.
  useEffect(() => {
    function onHash() {
      const match = /^#book(?::(.+))?$/.exec(window.location.hash);
      if (!match) return;
      const slug = match[1] && decodeURIComponent(match[1]);
      if (slug && doctors.some((d) => d.slug === slug)) setDoctor(slug);
      setSentLink(null);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      cardRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
    const frame = requestAnimationFrame(onHash);
    window.addEventListener("hashchange", onHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHash);
    };
  }, [doctors]);

  const today = now?.date ?? null;
  const tomorrow = today ? addDays(today, 1) : null;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const mobile = normaliseMobile(String(data.get("phone") ?? ""));
    const chosen = doctors.find((d) => d.slug === doctor);

    const found: Partial<Record<Field, string>> = {};
    if (!chosen) found.doctor = t.errors.doctor;
    if (!date || (today && date < today)) found.date = t.errors.date;
    if (name.length < 2) found.name = t.errors.name;
    if (!mobile) found.phone = t.errors.phone;
    setErrors(found);

    const firstInvalid = (["doctor", "date", "name", "phone"] as Field[]).find((f) => found[f]);
    if (firstInvalid || !chosen || !mobile) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus();
      return;
    }

    const prettyDate = new Intl.DateTimeFormat(lang === "bn" ? "bn-IN" : "en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "Asia/Kolkata",
    }).format(new Date(`${date}T12:00:00+05:30`));

    const link = whatsappLink(
      whatsapp,
      t.message({
        clinic: clinicName,
        doctor: chosen.name,
        date: prettyDate,
        name,
        phone: formatPhone(`+91${mobile}`),
      }),
    );
    setSentLink(link);
    window.location.href = link;
  }

  const describedBy = (field: Field) => (errors[field] ? `book-${field}-error` : undefined);
  const errorText = (field: Field) =>
    errors[field] && (
      <p id={`book-${field}-error`} className="mt-1.5 text-sm font-medium text-[#b42318]">
        {errors[field]}
      </p>
    );

  return (
    <div
      id="book"
      ref={cardRef}
      className="hero-rise scroll-mt-24 rounded-3xl border border-line bg-surface p-4 shadow-panel min-[400px]:p-5 md:p-7"
      style={{ "--delay": "520ms" } as React.CSSProperties}
    >
      <h2 className="text-2xl font-semibold tracking-[-0.01em]">{t.title}</h2>

      {sentLink ? (
        <div role="status" className="list-settle mt-5">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand">
            <Check aria-hidden="true" className="h-6 w-6" />
          </span>
          <p className="mt-4 text-lg font-semibold">{t.sentTitle}</p>
          <p className="mt-1 text-ink-muted">{t.sentBody}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={sentLink}
              className="press inline-flex h-12 items-center gap-2 rounded-full bg-brand px-5 font-medium text-white hover:bg-brand-strong"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
              {t.sendAgain}
            </a>
            <button
              type="button"
              onClick={() => setSentLink(null)}
              className="press inline-flex h-12 items-center gap-2 rounded-full border border-line px-5 font-medium hover:border-ink/30"
            >
              <Pencil aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
              {t.edit}
            </button>
          </div>
        </div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-5 space-y-5">
          <fieldset>
            <legend className="text-sm font-medium">{t.doctor}</legend>
            <div className="mt-2 grid gap-2" aria-describedby={describedBy("doctor")}>
              {doctors.map((d, i) => {
                const selected = doctor === d.slug;
                return (
                  <label
                    key={d.slug}
                    className={`press flex cursor-pointer items-center gap-3 rounded-2xl border p-2.5 pr-4 transition-colors ${
                      selected
                        ? "border-brand bg-brand-soft/60 ring-1 ring-brand"
                        : "border-line hover:border-ink/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="doctor"
                      value={d.slug}
                      checked={selected}
                      onChange={() => setDoctor(d.slug)}
                      data-field={i === 0 ? "doctor" : undefined}
                      className="sr-only"
                    />
                    {/* The initials are decoration; on the narrowest phones the name needs the room. */}
                    <span className="max-[359px]:hidden">
                      <Avatar name={d.nameEn} photoUrl={d.photoUrl} />
                    </span>
                    {/* A no-break space keeps "Dr." with the first name when the name wraps. */}
                    <span className="min-w-0 flex-1 font-medium">
                      {d.name.replace(/^(Dr\.|ডাঃ) /, "$1\u00a0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors ${
                        selected ? "border-brand bg-brand text-white" : "border-line"
                      }`}
                    >
                      {selected && <Check className="h-4 w-4" />}
                    </span>
                  </label>
                );
              })}
            </div>
            {errorText("doctor")}
          </fieldset>

          <div>
            <label htmlFor="book-date" className="text-sm font-medium">
              {t.date}
            </label>
            {/* Phones and tablets: Today and Tomorrow side by side, the date picker on its own row so it is
                never squeezed. Wide screens (1280px and up): all three in one row. */}
            <div className="mt-2 grid grid-cols-2 gap-2 xl:grid-cols-[auto_auto_minmax(0,1fr)]">
              {[
                { value: today, label: t.today },
                { value: tomorrow, label: t.tomorrow },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  disabled={!chip.value}
                  aria-pressed={chip.value !== null && date === chip.value}
                  onClick={() => chip.value && setDate(chip.value)}
                  className={`press h-12 rounded-xl border px-4 font-medium transition-colors disabled:opacity-50 ${
                    chip.value && date === chip.value
                      ? "border-brand bg-brand text-white"
                      : "border-line hover:border-ink/30"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
              <input
                id="book-date"
                name="date"
                type="date"
                data-field="date"
                value={date}
                min={today ?? undefined}
                onChange={(e) => setDate(e.target.value)}
                aria-invalid={Boolean(errors.date)}
                aria-describedby={describedBy("date")}
                className={`${fieldStyle} col-span-2 min-w-0 xl:col-span-1 ${errors.date ? "border-[#b42318]" : "border-line"}`}
              />
            </div>
            {errorText("date")}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            <div>
              <label htmlFor="book-name" className="text-sm font-medium">
                {t.name}
              </label>
              <input
                id="book-name"
                name="name"
                type="text"
                data-field="name"
                autoComplete="name"
                maxLength={60}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy("name")}
                className={`${fieldStyle} mt-2 ${errors.name ? "border-[#b42318]" : "border-line"}`}
              />
              {errorText("name")}
            </div>
            <div>
              <label htmlFor="book-phone" className="text-sm font-medium">
                {t.phone}
              </label>
              <input
                id="book-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                data-field="phone"
                autoComplete="tel-national"
                placeholder={t.phoneHint}
                maxLength={16}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={describedBy("phone")}
                className={`${fieldStyle} mt-2 tabular-nums placeholder:text-ink-muted/60 ${
                  errors.phone ? "border-[#b42318]" : "border-line"
                }`}
              />
              {errorText("phone")}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="press inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-[1.0625rem] font-medium text-white hover:bg-brand-strong"
            >
              <MessageCircle aria-hidden="true" className="h-5 w-5 shrink-0" />
              {t.submit}
            </button>
            <p className="mt-3 text-center text-sm text-ink-muted">{t.note}</p>
          </div>
        </form>
      )}
    </div>
  );
}
