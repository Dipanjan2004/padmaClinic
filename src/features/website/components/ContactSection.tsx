import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { ClinicInfo } from "@/features/website-content/types";
import { dictionary, directionsLink, formatPhone, mapEmbedSrc, pick, whatsappLink, type Lang } from "../i18n";
import { buttonPrimary, buttonSecondary } from "./buttons";

function Detail({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="relative flex items-center gap-3 px-4 py-5 transition-colors has-[a:hover]:bg-mist/60 min-[400px]:gap-4 min-[400px]:px-5 md:px-7">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
        <Icon aria-hidden="true" strokeWidth={1.75} className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <dt className="text-sm text-ink-muted">{label}</dt>
        <dd className="mt-0.5 text-base font-medium min-[400px]:text-lg">{children}</dd>
      </div>
    </div>
  );
}

/**
 * One card: the clinic's details on the left and the map on the right, the same
 * height side by side on wide screens and stacked on phones.
 */
export function ContactSection({ lang, clinic }: { lang: Lang; clinic: ClinicInfo }) {
  const t = dictionary(lang);
  const directions = directionsLink(clinic);
  const mapSrc = mapEmbedSrc(clinic, lang);
  const name = pick(lang, clinic.name);

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
      <h2 className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">{t.contact.title}</h2>
      <div
        className={`mt-8 grid overflow-hidden rounded-[1.75rem] border border-line bg-surface md:rounded-[2.25rem] ${
          mapSrc ? "md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]" : ""
        }`}
      >
        <div className="flex flex-col">
          <dl className="divide-y divide-line">
            {clinic.phone && (
              <Detail icon={Phone} label={t.contact.phone}>
                <a
                  href={`tel:${clinic.phone}`}
                  className="tabular-nums after:absolute after:inset-0 hover:text-brand"
                >
                  {formatPhone(clinic.phone)}
                </a>
              </Detail>
            )}
            {clinic.whatsapp && (
              <Detail icon={MessageCircle} label={t.contact.whatsapp}>
                <a
                  href={whatsappLink(clinic.whatsapp, t.whatsappMessage)}
                  className="tabular-nums after:absolute after:inset-0 hover:text-brand"
                >
                  {formatPhone(clinic.whatsapp)}
                </a>
              </Detail>
            )}
            {clinic.email && (
              <Detail icon={Mail} label={t.contact.email}>
                <a
                  href={`mailto:${clinic.email}`}
                  className="[overflow-wrap:anywhere] after:absolute after:inset-0 hover:text-brand"
                >
                  {clinic.email}
                </a>
              </Detail>
            )}
            {clinic.address && (
              <Detail icon={MapPin} label={t.contact.address}>
                {pick(lang, clinic.address)}
              </Detail>
            )}
            {clinic.hours && (
              <Detail icon={Clock} label={t.contact.hours}>
                {pick(lang, clinic.hours)}
              </Detail>
            )}
            {clinic.owner && (
              <Detail icon={UserRound} label={t.contact.owner}>
                {pick(lang, clinic.owner)}
              </Detail>
            )}
          </dl>
          <div className="mt-auto grid grid-cols-2 gap-3 border-t border-line p-5 md:px-7 md:py-6">
            {directions && (
              <a href={directions} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                <Navigation aria-hidden="true" className="h-4 w-4" />
                {t.actions.directions}
              </a>
            )}
            {clinic.phone && (
              <a href={`tel:${clinic.phone}`} className={buttonSecondary}>
                <Phone aria-hidden="true" className="h-4 w-4 text-brand" />
                {t.actions.call}
              </a>
            )}
          </div>
        </div>

        {mapSrc && (
          <iframe
            src={mapSrc}
            title={t.contact.mapTitle(name)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block aspect-[4/3] w-full border-t border-line bg-mist md:aspect-auto md:h-full md:min-h-[26rem] md:border-t-0 md:border-l"
          />
        )}
      </div>
    </section>
  );
}
