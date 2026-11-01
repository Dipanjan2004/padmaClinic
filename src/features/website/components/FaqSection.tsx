import { MessageCircle, Phone } from "lucide-react";
import type { PublicFaq } from "@/features/website-content/types";
import { dictionary, formatPhone, pick, whatsappLink, type Lang } from "../i18n";
import { FaqAccordion } from "./FaqAccordion";

/**
 * Common questions (D-044, D-045): the answers as an accordion, with a clinic-blue
 * "Still have a question?" card (under the heading on wide screens, last on phones).
 */
export function FaqSection({
  lang,
  faqs,
  phone,
  whatsapp,
}: {
  lang: Lang;
  faqs: PublicFaq[];
  phone: string | null;
  whatsapp: string | null;
}) {
  const t = dictionary(lang);
  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
      {/* Phones: heading, questions, then the contact card. Wide screens: heading and card on the left. */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16">
        <div className="lg:col-start-1 lg:row-start-1">
          <h2 className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">{t.faq.title}</h2>
          <p className="mt-3 max-w-sm text-ink-muted md:text-lg">{t.faq.intro}</p>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <FaqAccordion
            items={faqs.map((faq) => ({
              question: pick(lang, faq.question),
              answer: pick(lang, faq.answer),
            }))}
          />
        </div>

        {(phone || whatsapp) && (
          <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
            <div className="rounded-[1.5rem] bg-brand p-6 text-white md:p-7">
              <p className="font-display text-2xl font-medium tracking-[-0.02em] [:lang(bn)_&]:tracking-normal">
                {t.faq.askTitle}
              </p>
              <p className="mt-1.5 text-white/85">{t.faq.askBody}</p>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="mt-5 inline-block font-display text-3xl font-medium tracking-[-0.02em] tabular-nums transition-colors hover:text-lime"
                >
                  {formatPhone(phone)}
                </a>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="press inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 font-medium text-ink hover:bg-white/90"
                  >
                    <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                    {t.actions.call}
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={whatsappLink(whatsapp, t.whatsappMessage)}
                    className="press inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-5 font-medium text-white hover:bg-white/10"
                  >
                    <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {t.actions.whatsapp}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
