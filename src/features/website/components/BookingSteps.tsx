import Image from "next/image";
import { MessageCircle } from "lucide-react";
import bandImage from "@/assets/images/clinic-consult.jpg";
import type { ClinicInfo } from "@/features/website-content/types";
import { bookPath, dictionary, localDigits, whatsappLink, type Lang } from "../i18n";

const base =
  "press inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 font-medium whitespace-nowrap";

/** "How booking works" on a full-width clinic photograph. */
export function BookingSteps({ lang, clinic }: { lang: Lang; clinic: ClinicInfo }) {
  const t = dictionary(lang);

  return (
    <section id="booking" className="relative isolate overflow-hidden bg-navy text-white">
      <Image
        src={bandImage}
        alt=""
        fill
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover object-[70%_28%]"
      />
      {/* Keeps the text readable: solid on phones, fading towards the patient on larger screens. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-navy/85 md:bg-transparent md:bg-[linear-gradient(90deg,rgb(14_34_64/0.97)_0%,rgb(14_34_64/0.9)_48%,rgb(14_34_64/0.2)_100%)]"
      />

      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-24">
        <h2 className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">{t.steps.title}</h2>
        <ol className="mt-9 grid max-w-xl gap-7">
          {t.steps.items.map((step, i) => (
            <li
              key={step.title}
              className="relative flex gap-4 [&:not(:last-child)]:before:absolute [&:not(:last-child)]:before:top-11 [&:not(:last-child)]:before:-bottom-6 [&:not(:last-child)]:before:left-5 [&:not(:last-child)]:before:w-px [&:not(:last-child)]:before:bg-white/25"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 font-display text-lg font-semibold ring-1 ring-white/25">
                {localDigits(lang, i + 1)}
              </span>
              <div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-1 text-white/75">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={bookPath()} className={`${base} bg-white text-navy hover:bg-white/90`}>
            {t.actions.book}
          </a>
          {clinic.whatsapp && (
            <a
              href={whatsappLink(clinic.whatsapp, t.whatsappMessage)}
              className={`${base} border border-white/30 text-white hover:bg-white/10`}
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              {t.actions.whatsapp}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
