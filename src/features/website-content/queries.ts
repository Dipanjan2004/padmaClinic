import { clinicContent } from "./content";
import type { PublicSiteData } from "./types";

/**
 * The website's only source of clinic content. It reads from `content.ts` until
 * the database exists, and then from Supabase (D-018, D-023).
 */
export async function getPublicSiteData(): Promise<PublicSiteData> {
  return clinicContent;
}
