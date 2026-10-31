import type { Weekday } from "@/lib/clinic-time";
import type { ClinicInfo, Localized } from "@/features/website-content/types";

export type Lang = "en" | "bn";

export type BookingRequest = { clinic: string; doctor: string; date: string; name: string; phone: string };

const en = {
  meta: { title: "Doctors and appointments" },
  nav: {
    label: "Main",
    timings: "Timings",
    doctors: "Doctors",
    booking: "How to book",
    labTests: "Lab tests",
    services: "Services",
    contact: "Contact",
    menu: "Menu",
    close: "Close menu",
  },
  switchTo: { label: "বাংলা", aria: "এই পাতা বাংলায় পড়ুন", href: "/bn", lang: "bn" },
  actions: {
    book: "Book appointment",
    bookShort: "Book now",
    call: "Call",
    whatsapp: "WhatsApp",
    directions: "Directions",
  },
  hero: {
    title: { start: "Book your doctor's", highlight: "appointment", end: "" },
    tagline: "Choose a doctor and a day. Reception confirms your serial.",
    orCall: "Prefer to call?",
    badge: "Book your serial",
    meetDoctors: "Meet our doctors",
  },
  booking: {
    title: "Book an appointment",
    doctor: "Doctor",
    date: "Preferred day",
    today: "Today",
    tomorrow: "Tomorrow",
    name: "Patient's name",
    phone: "Mobile number",
    phoneHint: "10-digit mobile number",
    submit: "Send request on WhatsApp",
    note: "Reception confirms your serial and time by phone or WhatsApp.",
    errors: {
      doctor: "Choose a doctor.",
      date: "Choose today or a later day.",
      name: "Enter the patient's name.",
      phone: "Enter a 10-digit mobile number.",
    },
    sentTitle: "WhatsApp is opening",
    sentBody: "Send the message there. Reception will confirm your serial and time.",
    sendAgain: "Open WhatsApp again",
    edit: "Change details",
    message: (r: BookingRequest) =>
      [
        `Appointment request – ${r.clinic}`,
        `Doctor: ${r.doctor}`,
        `Preferred day: ${r.date}`,
        `Patient: ${r.name}`,
        `Mobile: ${r.phone}`,
      ].join("\n"),
  },
  today: {
    title: "Today",
    live: "In now",
    later: "Later",
    done: "Finished",
    none: "No doctor is in today.",
    loading: "Checking today's timings",
    seeWeek: "See the whole week",
  },
  week: {
    title: "When doctors are in",
    note: "Times are approximate. Reception confirms your serial.",
    tabs: "Days of the week",
    today: "Today",
    empty: "No doctor visits on this day.",
    until: (time: string) => `till ${time}`,
    bookWith: (name: string) => `Book with ${name}`,
  },
  doctors: {
    title: "Our doctors",
    days: "Visiting days",
    visits: (days: string) => `Visits on ${days}`,
    callForTimings: "Call the clinic for timings",
    workedAt: (place: string) => `Worked at ${place}`,
  },
  steps: {
    title: "How booking works",
    items: [
      { title: "Send a request", body: "Online, by phone, or on WhatsApp." },
      { title: "Reception confirms", body: "You get your serial number and an approximate time." },
      {
        title: "Come in",
        body: "Pay the fee at reception and wait for your serial. If the doctor is running late, we'll tell you.",
      },
    ],
  },
  labs: {
    title: "Lab tests",
    intro: "Blood, urine and full body checkup tests. Find yours below.",
    partner: (name: string) => `Partner lab: ${name}`,
    search: "Search a test",
    searchHint: "Search a test, like CBC",
    clear: "Clear search",
    filters: "Filter by health concern",
    all: "All tests",
    count: (n: number) => (n === 1 ? "1 test" : `${n} tests`),
    found: (n: number) => (n === 1 ? "1 test found" : `${n} tests found`),
    tapHint: "Tap a test to see what it checks.",
    checkupTag: "Full body checkup",
    askCheckup: "Ask about packages",
    checkupMessage: "Hello, I'd like to know about the full body checkup packages.",
    moreTitle: "Don't see your test?",
    moreBody: "We do many more. Some tests need an empty stomach, so ask us before you come.",
    ask: "Ask on WhatsApp",
    askMessage: "Hello, I'd like to know about a lab test.",
    noMatch: (query: string) => `“${query}” isn't in this list, but we may still do it.`,
    askAbout: (query: string) => `Ask about “${query}”`,
    askQueryMessage: (query: string) => `Hello, do you do the ${query} test?`,
  },
  services: { title: "Services" },
  contact: {
    title: "Contact",
    phone: "Phone",
    whatsapp: "WhatsApp",
    email: "Email",
    owner: "Owner",
    address: "Address",
    hours: "Clinic hours",
    location: "Location",
    mapTitle: (name: string) => `${name} on Google Maps`,
  },
  footer: {
    clinic: "Clinic",
    doctors: "Doctors",
    contact: "Contact",
    rights: (name: string) => `© ${name}. All rights reserved.`,
    pharmacy: "Associated pharmacy: Jatindra Mohan Medico",
  },
  whatsappMessage: "Hello, I'd like to book an appointment.",
};

export type Dictionary = typeof en;

const bn: Dictionary = {
  meta: { title: "ডাক্তার ও সিরিয়াল" },
  nav: {
    label: "প্রধান",
    timings: "সময়সূচি",
    doctors: "ডাক্তার",
    booking: "কীভাবে বুক করবেন",
    labTests: "ল্যাব টেস্ট",
    services: "পরিষেবা",
    contact: "যোগাযোগ",
    menu: "মেনু",
    close: "মেনু বন্ধ করুন",
  },
  switchTo: { label: "English", aria: "Read this page in English", href: "/", lang: "en" },
  actions: {
    book: "সিরিয়াল বুক করুন",
    bookShort: "সিরিয়াল বুক",
    call: "ফোন করুন",
    whatsapp: "হোয়াটসঅ্যাপ",
    directions: "রাস্তা দেখুন",
  },
  hero: {
    title: { start: "ডাক্তারবাবুর", highlight: "সিরিয়াল", end: "বুক করুন" },
    tagline: "ডাক্তার আর দিন বেছে নিন। রিসেপশন সিরিয়াল নিশ্চিত করবে।",
    orCall: "ফোনে বুক করতে চান?",
    badge: "সিরিয়াল বুক করুন",
    meetDoctors: "আমাদের ডাক্তারবাবুরা",
  },
  booking: {
    title: "সিরিয়াল বুক করুন",
    doctor: "ডাক্তার",
    date: "কোন দিন আসতে চান",
    today: "আজ",
    tomorrow: "কাল",
    name: "রোগীর নাম",
    phone: "মোবাইল নম্বর",
    phoneHint: "১০ সংখ্যার মোবাইল নম্বর",
    submit: "হোয়াটসঅ্যাপে অনুরোধ পাঠান",
    note: "রিসেপশন ফোনে বা হোয়াটসঅ্যাপে সিরিয়াল ও সময় জানিয়ে দেবে।",
    errors: {
      doctor: "একজন ডাক্তার বেছে নিন।",
      date: "আজ বা পরের কোনো দিন বেছে নিন।",
      name: "রোগীর নাম লিখুন।",
      phone: "১০ সংখ্যার মোবাইল নম্বর লিখুন।",
    },
    sentTitle: "হোয়াটসঅ্যাপ খুলছে",
    sentBody: "ওখানে মেসেজটি পাঠিয়ে দিন। রিসেপশন সিরিয়াল ও সময় জানিয়ে দেবে।",
    sendAgain: "আবার হোয়াটসঅ্যাপ খুলুন",
    edit: "তথ্য বদলান",
    message: (r: BookingRequest) =>
      [
        `সিরিয়ালের অনুরোধ – ${r.clinic}`,
        `ডাক্তার: ${r.doctor}`,
        `দিন: ${r.date}`,
        `রোগীর নাম: ${r.name}`,
        `মোবাইল: ${r.phone}`,
      ].join("\n"),
  },
  today: {
    title: "আজ",
    live: "এখন বসছেন",
    later: "পরে বসবেন",
    done: "শেষ হয়েছে",
    none: "আজ কোনো ডাক্তারবাবু বসছেন না।",
    loading: "আজকের সময় দেখা হচ্ছে",
    seeWeek: "পুরো সপ্তাহ দেখুন",
  },
  week: {
    title: "কে কবে বসেন",
    note: "সময় আনুমানিক। সিরিয়াল রিসেপশন থেকে নিশ্চিত করা হয়।",
    tabs: "সপ্তাহের দিন",
    today: "আজ",
    empty: "এই দিনে কোনো ডাক্তারবাবু বসেন না।",
    until: (time: string) => `${time} পর্যন্ত`,
    bookWith: (name: string) => `${name}-এর সিরিয়াল বুক করুন`,
  },
  doctors: {
    title: "আমাদের ডাক্তারবাবুরা",
    days: "বসার দিন",
    visits: (days: string) => `বসেন ${days}`,
    callForTimings: "সময় জানতে ক্লিনিকে ফোন করুন",
    workedAt: (place: string) => `অভিজ্ঞতা: ${place}`,
  },
  steps: {
    title: "সিরিয়াল কীভাবে পাবেন",
    items: [
      { title: "অনুরোধ পাঠান", body: "অনলাইনে, ফোনে বা হোয়াটসঅ্যাপে।" },
      { title: "রিসেপশন নিশ্চিত করবে", body: "সিরিয়াল নম্বর আর আনুমানিক সময় জানিয়ে দেওয়া হবে।" },
      {
        title: "চলে আসুন",
        body: "রিসেপশনে ফি জমা দিয়ে সিরিয়ালের অপেক্ষা করুন। ডাক্তারবাবুর দেরি হলে আমরা জানিয়ে দেব।",
      },
    ],
  },
  labs: {
    title: "ল্যাব টেস্ট",
    intro: "রক্ত, প্রস্রাব আর ফুল বডি চেকআপের পরীক্ষা। নিচে আপনার টেস্ট খুঁজে নিন।",
    partner: (name: string) => `পার্টনার ল্যাব: ${name}`,
    search: "টেস্ট খুঁজুন",
    searchHint: "টেস্ট খুঁজুন, যেমন CBC",
    clear: "খোঁজা মুছুন",
    filters: "শরীরের সমস্যা অনুযায়ী বাছুন",
    all: "সব টেস্ট",
    count: (n: number) => `${localDigits("bn", n)}টি পরীক্ষা`,
    found: (n: number) => `${localDigits("bn", n)}টি পরীক্ষা পাওয়া গেছে`,
    tapHint: "কোন টেস্টে কী দেখা হয়, জানতে নামের ওপর চাপুন।",
    checkupTag: "ফুল বডি চেকআপ",
    askCheckup: "প্যাকেজের খোঁজ নিন",
    checkupMessage: "নমস্কার, ফুল বডি চেকআপ প্যাকেজ নিয়ে জানতে চাই।",
    moreTitle: "আপনার টেস্ট এখানে নেই?",
    moreBody: "আরও অনেক পরীক্ষা হয়। কিছু টেস্টের আগে খালি পেটে থাকতে হয়, তাই আসার আগে জেনে নিন।",
    ask: "হোয়াটসঅ্যাপে জানুন",
    askMessage: "নমস্কার, একটা ল্যাব টেস্ট নিয়ে জানতে চাই।",
    noMatch: (query: string) => `“${query}” এই তালিকায় নেই, তবে হয়তো আমরা করি।`,
    askAbout: (query: string) => `“${query}” নিয়ে জিজ্ঞেস করুন`,
    askQueryMessage: (query: string) => `নমস্কার, আপনাদের এখানে কি ${query} টেস্ট হয়?`,
  },
  services: { title: "পরিষেবা" },
  contact: {
    title: "যোগাযোগ",
    phone: "ফোন",
    whatsapp: "হোয়াটসঅ্যাপ",
    email: "ইমেল",
    owner: "স্বত্বাধিকারী",
    address: "ঠিকানা",
    hours: "ক্লিনিক খোলা থাকে",
    location: "লোকেশন",
    mapTitle: (name: string) => `গুগল ম্যাপে ${name}`,
  },
  footer: {
    clinic: "ক্লিনিক",
    doctors: "ডাক্তারবাবু",
    contact: "যোগাযোগ",
    rights: (name: string) => `© ${name}। সর্বস্বত্ব সংরক্ষিত।`,
    pharmacy: "সহযোগী ওষুধের দোকান: যতীন্দ্র মোহন মেডিকো",
  },
  whatsappMessage: "নমস্কার, আমি একটা সিরিয়াল বুক করতে চাই।",
};

export function dictionary(lang: Lang): Dictionary {
  return lang === "bn" ? bn : en;
}

export function pick(lang: Lang, text: Localized): string {
  return lang === "bn" ? (text.bn ?? text.en) : text.en;
}

// ---- Paths and outbound links ----

export function homePath(lang: Lang, hash = ""): string {
  return (lang === "bn" ? "/bn" : "/") + hash;
}

/**
 * Every "Book" button points at the booking card on the same page. `#book:<slug>`
 * also picks the doctor (BookingCard listens for it). Use a plain <a>, not <Link>,
 * so the browser fires `hashchange`.
 */
export function bookPath(doctorSlug?: string): string {
  return doctorSlug ? `#book:${doctorSlug}` : "#book";
}

export function whatsappLink(e164: string, message: string): string {
  return `https://wa.me/${e164.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

/** Opens Google Maps (the app on phones) straight into directions to the clinic. */
export function directionsLink(clinic: ClinicInfo): string | null {
  if (clinic.location) {
    const { lat, lng } = clinic.location;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  return clinic.mapsUrl;
}

export function mapEmbedSrc(clinic: ClinicInfo, lang: Lang): string | null {
  if (!clinic.location) return null;
  const { lat, lng } = clinic.location;
  return `https://maps.google.com/maps?q=${lat},${lng}&z=17&hl=${lang}&output=embed`;
}

// ---- Numbers, days and times ----

const BENGALI_DIGITS = "০১২৩৪৫৬৭৮৯";

export function localDigits(lang: Lang, value: string | number): string {
  const text = String(value);
  return lang === "bn" ? text.replace(/[0-9]/g, (d) => BENGALI_DIGITS[Number(d)]) : text;
}

/** Monday first, the way clinic notice boards read. */
export const WEEK_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

const DAY_SHORT: Record<Lang, string[]> = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  bn: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"],
};

const DAY_LONG: Record<Lang, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  bn: ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"],
};

const DAY_LETTER: Record<Lang, string[]> = {
  en: ["S", "M", "T", "W", "T", "F", "S"],
  bn: ["র", "সো", "ম", "বু", "বৃ", "শু", "শ"],
};

export const dayShort = (lang: Lang, day: Weekday) => DAY_SHORT[lang][day];
export const dayLong = (lang: Lang, day: Weekday) => DAY_LONG[lang][day];
export const dayLetter = (lang: Lang, day: Weekday) => DAY_LETTER[lang][day];

/** Bengali names the part of the day instead of using am/pm: সকাল, দুপুর, বিকেল, সন্ধ্যা, রাত. */
function bengaliDayPart(hour: number): string {
  if (hour >= 4 && hour < 12) return "সকাল";
  if (hour >= 12 && hour < 16) return "দুপুর";
  if (hour >= 16 && hour < 18) return "বিকেল";
  if (hour >= 18 && hour < 20) return "সন্ধ্যা";
  return "রাত";
}

/** "18:30" → "6:30 pm" / "সন্ধ্যা ৬:৩০"; "18:00" → "6 pm" / "সন্ধ্যা ৬টা". */
export function formatTime(lang: Lang, hhmm: string): string {
  const [hour, minute] = hhmm.split(":").map(Number);
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const mm = String(minute).padStart(2, "0");
  if (lang === "en") {
    return `${hour12}${minute ? `:${mm}` : ""} ${hour < 12 ? "am" : "pm"}`;
  }
  return `${bengaliDayPart(hour)} ${localDigits("bn", minute ? `${hour12}:${mm}` : `${hour12}টা`)}`;
}

export function formatTimeRange(lang: Lang, start: string, end: string): string {
  return `${formatTime(lang, start)} – ${formatTime(lang, end)}`;
}

/** +919830337825 → +91 98303 37825. Phone numbers stay in Latin digits so they can be dialled. */
export function formatPhone(e164: string): string {
  const match = /^\+91(\d{5})(\d{5})$/.exec(e164);
  return match ? `+91 ${match[1]} ${match[2]}` : e164;
}
