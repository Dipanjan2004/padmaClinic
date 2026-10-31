import type { Metadata, Viewport } from "next";
import { siteUrl } from "@/lib/site-url";
import "../globals.css";
import { bodyBengali, displayBengali, geist } from "../fonts";

export const metadata: Metadata = {
  metadataBase: siteUrl,
};

export const viewport: Viewport = { themeColor: "#ffffff", viewportFit: "cover" };

/** Root layout for the Bengali website (/bn). */
export default function BengaliRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn-IN" className={`${geist.variable} ${displayBengali.variable} ${bodyBengali.variable}`}>
      <body>{children}</body>
    </html>
  );
}
