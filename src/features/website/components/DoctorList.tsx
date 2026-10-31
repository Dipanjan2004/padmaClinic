import Image from "next/image";
import { ArrowUpRight, Building2, GraduationCap, Phone } from "lucide-react";
import type { PublicDoctor } from "@/features/website-content/types";
import { WEEK_ORDER, bookPath, dayLetter, dayLong, dictionary, pick, type Lang } from "../i18n";
import { initials } from "./Avatar";

export function DoctorList({ lang, doctors }: { lang: Lang; doctors: PublicDoctor[] }) {
  const t = dictionary(lang);

  return (
    <section id="doctors" className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
      <h2 className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">{t.doctors.title}</h2>
      <ul className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
        {doctors.map((doctor) => {
          const name = pick(lang, doctor.name);
          const days = new Set(doctor.sessions.map((s) => s.weekday));
          const visitDays = WEEK_ORDER.filter((d) => days.has(d)).map((d) => dayLong(lang, d));
          return (
            <li key={doctor.slug}>
              <article className="group flex h-full flex-col rounded-[1.75rem] border border-line bg-surface p-2 transition duration-300 ease-out-expo md:hover:-translate-y-1 md:hover:shadow-panel">
                {/* Portrait panel: the doctor's photo once the clinic supplies it, their initials until then. */}
                <div className="relative isolate h-40 overflow-hidden rounded-[1.375rem] bg-brand md:h-52">
                  {doctor.photoUrl ? (
                    <Image
                      src={doctor.photoUrl}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 560px, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                        className="absolute -top-12 -right-12 h-60 w-60 text-white/[0.08] transition-transform duration-700 ease-out-expo group-hover:rotate-90 motion-reduce:transition-none"
                      >
                        <path d="M13.5 8.5h5v5h5v5h-5v5h-5v-5h-5v-5h5z" fill="currentColor" />
                      </svg>
                      <span
                        aria-hidden="true"
                        className="absolute bottom-1 left-5 font-display text-[5.5rem] leading-none font-medium tracking-[-0.04em] text-lime md:left-6 md:text-[7rem]"
                      >
                        {initials(doctor.name.en)}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-1 flex-col px-4 pt-5 pb-4 md:px-5">
                  <h3 className="text-2xl font-semibold tracking-[-0.01em]">{name}</h3>
                  {(doctor.qualifications || doctor.speciality) && (
                    <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                      {doctor.qualifications && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand">
                          <GraduationCap aria-hidden="true" className="h-4 w-4" />
                          {doctor.qualifications}
                        </span>
                      )}
                      {doctor.speciality && (
                        <span className="font-medium text-ink-muted">{pick(lang, doctor.speciality)}</span>
                      )}
                    </p>
                  )}

                  <ul className="mt-4 space-y-2.5 text-[0.95rem] text-ink-muted">
                    {doctor.pastWork.map((place) => (
                      <li key={place.en} className="flex items-start gap-2.5">
                        <Building2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        {t.doctors.workedAt(pick(lang, place))}
                      </li>
                    ))}
                    {days.size === 0 && (
                      <li className="flex items-start gap-2.5">
                        <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        {t.doctors.callForTimings}
                      </li>
                    )}
                  </ul>

                  {days.size > 0 && (
                    <>
                      <p className="mt-5 text-sm text-ink-muted">{t.doctors.days}</p>
                      <p className="sr-only">{t.doctors.visits(visitDays.join(", "))}</p>
                      <ol aria-hidden="true" className="mt-2 grid grid-cols-7 gap-1">
                        {WEEK_ORDER.map((weekday) => (
                          <li
                            key={weekday}
                            className={`grid h-8 place-items-center rounded-lg text-xs font-medium ${
                              days.has(weekday) ? "bg-brand text-white" : "bg-mist text-ink-muted/60"
                            }`}
                          >
                            {dayLetter(lang, weekday)}
                          </li>
                        ))}
                      </ol>
                    </>
                  )}

                  <div className="mt-auto pt-6">
                    <a
                      href={bookPath(doctor.slug)}
                      aria-label={t.week.bookWith(name)}
                      className="press group/book inline-flex h-12 items-center gap-2 rounded-full bg-brand pr-1.5 pl-5 font-medium text-white hover:bg-brand-strong"
                    >
                      {t.actions.book}
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-lime text-ink">
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover/book:rotate-45"
                        />
                      </span>
                    </a>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
