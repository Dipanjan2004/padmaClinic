/**
 * The site's public address, used for canonical and language links.
 * APP_BASE_URL wins (set it once the clinic has its own domain). On Vercel the
 * project's production address is used automatically; locally, localhost.
 */
export const siteUrl = new URL(
  process.env.APP_BASE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);
