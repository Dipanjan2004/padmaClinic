import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { PublicDoctor } from "@/features/website-content/types";
import { WEEK_ORDER, bookPath, dayLong, dictionary, pick, type Lang } from "../i18n";

/** The Rod of Asclepius, the emblem of medicine (one serpent, no wings). Drawn for this site. */
function RodOfAsclepius({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 128"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M32 10V122" strokeWidth="5" />
      <circle cx="32" cy="8" r="3.5" fill="currentColor" stroke="none" />
      <path
        d="M30 116C14 112 14 100 32 96C50 92 50 80 32 76C14 72 14 60 32 56C50 52 50 40 32 36C18 33 17 24 26 20C30 18 35 19 38 22"
        strokeWidth="5.5"
      />
      <path d="M38 22C42 20 46 21 47 24C46 27 42 28 38 26Z" fill="currentColor" strokeWidth="2" />
    </svg>
  );
}

/**
 * The doctors as a list of chamber nameplates, the way doctors in Bengal present
 * themselves: the name large, in English and Bengali, the degree and facts as plain
 * text, and one clear Book action. A photo sits beside the name once supplied.
 */
export function DoctorList({ lang, doctors }: { lang: Lang; doctors: PublicDoctor[] }) {
  const t = dictionary(lang);
  const altLang = lang === "bn" ? "en" : "bn";

  return (
    <section id="doctors" className="relative isolate mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
      {/* A quiet watermark of the medical emblem; faded as one layer so its crossings don't darken. */}
      <RodOfAsclepius className="pointer-events-none absolute top-8 right-2 -z-10 h-72 text-brand opacity-[0.07] md:top-10 md:right-6 md:h-[30rem]" />
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
        <h2 className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">{t.doctors.title}</h2>
        <p className="max-w-sm text-ink-muted md:text-right">{t.doctors.intro}</p>
      </div>

      <ul className="mt-8 border-t border-line">
        {doctors.map((doctor) => {
          const name = pick(lang, doctor.name);
          const altName = lang === "bn" ? doctor.name.en : doctor.name.bn;
          const days = new Set(doctor.sessions.map((s) => s.weekday));
          const visitDays = WEEK_ORDER.filter((d) => days.has(d)).map((d) => dayLong(lang, d));
          return (
            <li key={doctor.slug} className="border-b border-line">
              <article className="group grid gap-5 py-7 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_auto] md:items-center md:gap-10 md:py-9">
                <div className="flex min-w-0 items-center gap-4">
                  {doctor.photoUrl && (
                    <Image
                      src={doctor.photoUrl}
                      alt=""
                      width={72}
                      height={72}
                      className="h-16 w-16 shrink-0 rounded-full object-cover md:h-[4.5rem] md:w-[4.5rem]"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-display text-[1.75rem] leading-[1.05] font-medium tracking-[-0.03em] md:text-4xl [:lang(bn)_&]:leading-[1.25] [:lang(bn)_&]:tracking-normal">
                      {name}
                    </h3>
                    {altName && (
                      <p lang={altLang} className="mt-1.5 text-lg text-ink-muted">
                        {altName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-[0.95rem] text-ink-muted">
                  {doctor.qualifications && (
                    <p className="font-semibold tracking-[0.04em] text-ink">{doctor.qualifications}</p>
                  )}
                  {doctor.speciality && <p>{pick(lang, doctor.speciality)}</p>}
                  {doctor.pastWork.map((place) => (
                    <p key={place.en}>{t.doctors.workedAt(pick(lang, place))}</p>
                  ))}
                  <p>
                    {visitDays.length > 0 ? t.doctors.visits(visitDays.join(", ")) : t.doctors.callForTimings}
                  </p>
                </div>

                <div className="md:justify-self-end">
                  <a
                    href={bookPath(doctor.slug)}
                    aria-label={t.week.bookWith(name)}
                    className="press group/book inline-flex h-12 items-center gap-2 rounded-full bg-brand pr-1.5 pl-5 font-medium whitespace-nowrap text-white hover:bg-brand-strong"
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
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
