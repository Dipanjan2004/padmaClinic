import type { Metadata, Viewport } from "next";
import "../globals.css";
import { bodyBengali, displayBengali, geist } from "../fonts";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_BASE_URL ?? "http://localhost:3000"),
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
