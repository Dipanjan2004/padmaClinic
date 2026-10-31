import { Anek_Bangla, Geist, Hind_Siliguri } from "next/font/google";

// Geist sets all Latin text. The Bengali faces only draw Bengali glyphs, so each
// language preloads just what it shows first. Docs/DESIGN.md §5.

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

/** English pages: Bengali faces load on demand, e.g. for the "বাংলা" switch. */
export const displayOnDemand = Anek_Bangla({
  subsets: ["bengali"],
  variable: "--font-anek",
  display: "swap",
  preload: false,
});

export const bodyOnDemand = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600"],
  variable: "--font-hind",
  display: "swap",
  preload: false,
});

/** Bengali pages: preload the Bengali faces. */
export const displayBengali = Anek_Bangla({
  subsets: ["bengali"],
  variable: "--font-anek",
  display: "swap",
});

export const bodyBengali = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600"],
  variable: "--font-hind",
  display: "swap",
});
