import { Mail, MessageCircle, Navigation, Phone } from "lucide-react";
import type { ReactNode } from "react";
import type { ClinicInfo, PublicDoctor } from "@/features/website-content/types";
import { bookPath, dictionary, directionsLink, formatPhone, pick, whatsappLink, type Lang } from "../i18n";
import { LanguageSwitch } from "./LanguageSwitch";
import { ClinicMark } from "./ClinicMark";
import type { NavLink } from "./SiteNav";

function Column({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <h2 className="font-sans text-sm font-semibold tracking-wide text-white">{title}</h2>
      <ul className="mt-3 text-[0.95rem]">{children}</ul>
    </div>
  );
}

const linkStyle = "inline-flex min-h-10 items-center gap-2 text-white/85 transition-colors hover:text-white";

export function SiteFooter({
  lang,
  clinic,
  doctors,
  links,
}: {
  lang: Lang;
  clinic: ClinicInfo;
  doctors: PublicDoctor[];
  links: NavLink[];
}) {
  const t = dictionary(lang);
  const name = pick(lang, clinic.name);
  const directions = directionsLink(clinic);

  return (
    // The same inset blue panel as the hero, so the page opens and closes in one colour.
    // On phones the bottom padding keeps the panel clear of the fixed action bar.
    <footer className="px-3 pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:px-4 md:pb-4">
      <div className="rounded-[1.75rem] bg-brand text-white/85 md:rounded-[2.25rem]">
        <div className="mx-auto max-w-6xl px-5 pt-12 pb-8 md:px-8 md:pt-16 md:pb-10">
          {/* Phones and tablets: brand across the top, Clinic beside Doctors, then Contact full width so the email fits. Wide screens: four columns. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
            <div className="col-span-2 flex flex-wrap items-center justify-between gap-4 lg:col-span-1 lg:flex-col lg:flex-nowrap lg:items-start lg:justify-start">
              <div className="flex items-center gap-2.5">
                <ClinicMark className="h-8 w-8" inverse />
                <span className="font-display text-xl font-semibold text-white">{name}</span>
              </div>
              <LanguageSwitch lang={lang} tone="dark" className="lg:order-last lg:mt-2" />
              <p className="w-full max-w-sm text-[0.95rem]">{t.hero.tagline}</p>
              {clinic.owner && (
                <p className="w-full text-sm text-white/80">
                  {t.contact.owner}: <span className="text-white">{pick(lang, clinic.owner)}</span>
                </p>
              )}
            </div>

            <Column title={t.footer.clinic}>
              {links.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className={linkStyle}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={bookPath()} className={linkStyle}>
                  {t.actions.book}
                </a>
              </li>
            </Column>

            <Column title={t.footer.doctors}>
              {doctors.map((doctor) => (
                <li key={doctor.slug}>
                  <a href={bookPath(doctor.slug)} className={linkStyle}>
                    {pick(lang, doctor.name)}
                  </a>
                </li>
              ))}
            </Column>

            <Column title={t.footer.contact} className="col-span-2 lg:col-span-1">
              {clinic.phone && (
                <li>
                  <a href={`tel:${clinic.phone}`} className={`${linkStyle} tabular-nums`}>
                    <Phone aria-hidden="true" className="h-4 w-4" />
                    {formatPhone(clinic.phone)}
                  </a>
                </li>
              )}
              {clinic.whatsapp && (
                <li>
                  <a href={whatsappLink(clinic.whatsapp, t.whatsappMessage)} className={linkStyle}>
                    <MessageCircle aria-hidden="true" className="h-4 w-4" />
                    {t.actions.whatsapp}
                  </a>
                </li>
              )}
              {clinic.email && (
                <li>
                  <a href={`mailto:${clinic.email}`} className={`${linkStyle} [overflow-wrap:anywhere]`}>
                    <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {clinic.email}
                  </a>
                </li>
              )}
              {directions && (
                <li>
                  <a href={directions} target="_blank" rel="noopener noreferrer" className={linkStyle}>
                    <Navigation aria-hidden="true" className="h-4 w-4" />
                    {t.actions.directions}
                  </a>
                </li>
              )}
            </Column>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-white/20 pt-6 text-sm text-white/80 md:flex-row md:items-center md:justify-between">
            <p>{t.footer.rights(name)}</p>
            <p>{t.footer.pharmacy}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
