import Image from "next/image";
import { ArrowRight, Navigation, Phone } from "lucide-react";
import type { CSSProperties } from "react";
import heroImage from "@/assets/images/hero-booking-home.jpg";
import type { ClinicInfo, PublicDoctor } from "@/features/website-content/types";
import { bookPath, dictionary, directionsLink, formatPhone, pick, type Lang } from "../i18n";
import { Avatar } from "./Avatar";
import { BookingCard } from "./BookingCard";
import { RotatingBadge } from "./RotatingBadge";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * An inset blue panel that says plainly what the site is for, with the booking
 * card as its visual (D-025). Behind it, toned blue: an elderly woman booking from
 * home on her laptop, the person this page is for (D-046).
 */
export function Hero({ lang, clinic, doctors }: { lang: Lang; clinic: ClinicInfo; doctors: PublicDoctor[] }) {
  const t = dictionary(lang);
  const directions = directionsLink(clinic);
  const { start, highlight, end } = t.hero.title;
  const options = doctors.map((d) => ({
    slug: d.slug,
    name: pick(lang, d.name),
    nameEn: d.name.en,
    photoUrl: d.photoUrl,
  }));

  return (
    <section className="px-3 pt-3 md:px-4 md:pt-4">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-brand text-white md:rounded-[2.25rem]">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-zoom -z-20 object-cover object-[38%_25%] opacity-45 mix-blend-luminosity md:object-[30%_30%] md:opacity-50"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-brand/60 md:bg-transparent md:bg-[linear-gradient(100deg,var(--color-brand)_22%,rgb(36_99_166/0.6)_48%,rgb(36_99_166/0.35)_100%)]"
        />

        <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-28 pb-4 min-[400px]:px-5 min-[400px]:pb-5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center md:gap-10 md:px-8 md:pt-36 md:pb-16 lg:gap-16">
          <div className="relative flow-root min-w-0">
            {/* Floats beside the headline on phones, so the words wrap around it and never sit under it.
                Beside the tagline on wide screens; hidden in between. */}
            <RotatingBadge
              text={t.hero.badge}
              label={t.actions.book}
              href={bookPath()}
              bengali={lang === "bn"}
              className="relative z-10 float-right -mt-1 mb-2 ml-3 w-20 md:hidden lg:absolute lg:float-none lg:m-0 lg:grid lg:top-auto lg:-right-6 lg:bottom-0 lg:w-32"
            />
            <h1
              className="hero-rise text-[clamp(2.8rem,11.5vw,5.75rem)] leading-[0.95] font-medium tracking-[-0.045em] [:lang(bn)_&]:text-[clamp(2rem,10vw,5.75rem)] [:lang(bn)_&]:leading-[1.2] [:lang(bn)_&]:font-semibold [:lang(bn)_&]:tracking-normal"
              style={delay(120)}
            >
              {start} <span className="text-lime">{highlight}</span>
              {end && ` ${end}`}
            </h1>

            {doctors.length > 0 && (
              <a
                href="#doctors"
                className="hero-rise group mt-7 inline-flex items-center gap-3 rounded-full"
                style={delay(240)}
              >
                <span className="flex -space-x-2.5">
                  {doctors.map((d) => (
                    <span key={d.slug} className="rounded-full ring-2 ring-brand">
                      <Avatar name={d.name.en} photoUrl={d.photoUrl} />
                    </span>
                  ))}
                </span>
                <span className="font-medium text-white/90 group-hover:text-white">{t.hero.meetDoctors}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 text-lime transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
            )}

            <p
              className="hero-rise mt-6 max-w-[34ch] text-lg text-white/85 md:text-xl lg:max-w-[30ch]"
              style={delay(320)}
            >
              {t.hero.tagline}
            </p>

            {(clinic.phone || directions) && (
              <div id="hero-actions" className="hero-rise mt-8 flex flex-wrap gap-3" style={delay(420)}>
                {clinic.phone && (
                  <a
                    href={`tel:${clinic.phone}`}
                    aria-label={`${t.actions.call} ${formatPhone(clinic.phone)}`}
                    className="press inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 font-medium text-ink tabular-nums hover:bg-white/90"
                  >
                    <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                    <span className="sm:hidden">{t.actions.call}</span>
                    <span className="hidden sm:inline">{formatPhone(clinic.phone)}</span>
                  </a>
                )}
                {directions && (
                  <a
                    href={directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-5 font-medium text-white hover:bg-white/10"
                  >
                    <Navigation aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {t.actions.directions}
                  </a>
                )}
              </div>
            )}
          </div>

          {clinic.whatsapp && (
            <div className="relative min-w-0 text-ink">
              <BookingCard
                lang={lang}
                clinicName={pick(lang, clinic.name)}
                doctors={options}
                whatsapp={clinic.whatsapp}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
