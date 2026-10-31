import type { Metadata } from "next";
import { getPublicSiteData } from "@/features/website-content/queries";
import type { PublicSiteData } from "@/features/website-content/types";
import { bookPath, dictionary, directionsLink, homePath, pick, whatsappLink, type Lang } from "./i18n";
import { BookingSteps } from "./components/BookingSteps";
import { ContactSection } from "./components/ContactSection";
import { DoctorList } from "./components/DoctorList";
import { Hero } from "./components/Hero";
import { MobileActionBar } from "./components/MobileActionBar";
import { ServiceList } from "./components/ServiceList";
import { SiteFooter } from "./components/SiteFooter";
import { LabTests } from "./components/LabTests";
import { SiteNav, type NavLink } from "./components/SiteNav";
import { WeekTimetable } from "./components/WeekTimetable";

export function homeMetadata(lang: Lang, data: PublicSiteData): Metadata {
  const t = dictionary(lang);
  const name = pick(lang, data.clinic.name);
  return {
    title: { absolute: `${name} · ${t.meta.title}` },
    description: t.hero.tagline,
    alternates: {
      canonical: lang === "bn" ? "/bn" : "/",
      languages: { "en-IN": "/", "bn-IN": "/bn" },
    },
    openGraph: { title: name, description: t.hero.tagline, locale: lang === "bn" ? "bn_IN" : "en_IN" },
  };
}

export async function HomePage({ lang }: { lang: Lang }) {
  const { clinic, doctors, services, labTests } = await getPublicSiteData();
  const t = dictionary(lang);
  const hasTimings = doctors.some((d) => d.sessions.length > 0);
  const whatsappHref = clinic.whatsapp ? whatsappLink(clinic.whatsapp, t.whatsappMessage) : null;
  const directionsHref = directionsLink(clinic);

  // Sections without real content yet are left out, and so are their links.
  const links: NavLink[] = [
    ...(hasTimings ? [{ id: "timings", label: t.nav.timings }] : []),
    { id: "doctors", label: t.nav.doctors },
    { id: "booking", label: t.nav.booking },
    ...(labTests ? [{ id: "lab-tests", label: t.nav.labTests }] : []),
    ...(services.length > 0 ? [{ id: "services", label: t.nav.services }] : []),
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <>
      <SiteNav
        lang={lang}
        clinicName={pick(lang, clinic.name)}
        homeHref={homePath(lang)}
        bookHref={bookPath()}
        links={links}
        doctors={doctors.map((d) => ({
          slug: d.slug,
          name: pick(lang, d.name),
          nameEn: d.name.en,
          photoUrl: d.photoUrl,
        }))}
        phone={clinic.phone}
        whatsappHref={whatsappHref}
        directionsHref={directionsHref}
        owner={clinic.owner ? pick(lang, clinic.owner) : null}
      />
      <main>
        <Hero lang={lang} clinic={clinic} doctors={doctors} />
        {hasTimings && <WeekTimetable lang={lang} doctors={doctors} />}
        <DoctorList lang={lang} doctors={doctors} />
        <BookingSteps lang={lang} clinic={clinic} />
        {labTests && (
          <LabTests lang={lang} labTests={labTests} whatsapp={clinic.whatsapp} phone={clinic.phone} />
        )}
        <ServiceList lang={lang} services={services} />
        <ContactSection lang={lang} clinic={clinic} />
      </main>
      <SiteFooter lang={lang} clinic={clinic} doctors={doctors} links={links} />
      <MobileActionBar
        bookHref={bookPath()}
        bookLabel={t.actions.bookShort}
        callHref={clinic.phone ? `tel:${clinic.phone}` : null}
        callLabel={t.actions.call}
        whatsappHref={whatsappHref}
        whatsappLabel={t.actions.whatsapp}
        directionsHref={directionsHref}
        directionsLabel={t.actions.directions}
      />
    </>
  );
}
