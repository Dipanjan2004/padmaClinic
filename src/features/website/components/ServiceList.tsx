import {
  Activity,
  Baby,
  CalendarCheck,
  HeartPulse,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import type { PublicService, ServiceIcon } from "@/features/website-content/types";
import { dictionary, pick, type Lang } from "../i18n";

const ICONS: Record<ServiceIcon, LucideIcon> = {
  stethoscope: Stethoscope,
  baby: Baby,
  "heart-pulse": HeartPulse,
  activity: Activity,
  syringe: Syringe,
  "calendar-check": CalendarCheck,
};

export function ServiceList({ lang, services }: { lang: Lang; services: PublicService[] }) {
  const t = dictionary(lang);
  if (services.length === 0) return null;

  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
      <h2 className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">{t.services.title}</h2>
      <ul className="mt-6 grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
        {services.map((service) => {
          const Icon = ICONS[service.icon];
          return (
            <li key={service.id} className="flex items-center gap-4 border-b border-line py-4">
              <Icon aria-hidden="true" strokeWidth={1.75} className="h-6 w-6 shrink-0 text-brand" />
              <span className="text-lg">{pick(lang, service.name)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
