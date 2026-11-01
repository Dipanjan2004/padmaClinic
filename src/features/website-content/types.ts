import type { Weekday } from "@/lib/clinic-time";

/** Text the admin enters. Bengali is optional and falls back to English (D-020). */
export type Localized = { en: string; bn?: string };

export type ServiceIcon = "stethoscope" | "baby" | "heart-pulse" | "activity" | "syringe" | "calendar-check";

export type ClinicInfo = {
  name: Localized;
  owner: Localized | null;
  address: Localized | null;
  hours: Localized | null;
  /** E.164, e.g. +919800000000 */
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  /** The clinic's Google Maps link, as shared by the owner. */
  mapsUrl: string | null;
  /** Exact pin, used for one-tap directions and the embedded map. */
  location: { lat: number; lng: number } | null;
};

/** One weekly session, in clinic time (Asia/Kolkata), "HH:MM". */
export type PublicSession = { weekday: Weekday; start: string; end: string };

/** Unknown details are null and simply not shown. Never fill them with guesses. */
export type PublicDoctor = {
  slug: string;
  name: Localized;
  qualifications: string | null;
  speciality: Localized | null;
  /** Hospitals the doctor has worked at, as the owner supplied them. */
  pastWork: Localized[];
  photoUrl: string | null;
  sessions: PublicSession[];
};

export type PublicService = { id: string; name: Localized; icon: ServiceIcon };

export type LabIcon = "thermometer" | "droplet" | "activity" | "heart-pulse" | "flask" | "test-tubes";

/** One lab test and, in plain words, what it checks. */
export type LabTest = { name: Localized; about: Localized };

export type LabCategory = { id: string; name: Localized; icon: LabIcon; tests: LabTest[] };

/** A full body checkup package and what it covers. */
export type LabCheckup = { name: Localized; about: Localized; covers: Localized[] };

/** Tests done through the clinic's partner lab. Prices and report times are not shown until the owner supplies them. */
export type PublicLabTests = { partner: Localized; checkup: LabCheckup | null; categories: LabCategory[] };

/** A question patients ask, answered only with facts the clinic has confirmed. */
export type PublicFaq = { question: Localized; answer: Localized };

export type PublicSiteData = {
  clinic: ClinicInfo;
  doctors: PublicDoctor[];
  services: PublicService[];
  labTests: PublicLabTests | null;
  faqs: PublicFaq[];
};
