import type { Metadata, Viewport } from "next";
import "../globals.css";
import { bodyOnDemand, displayOnDemand, geist } from "../fonts";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_BASE_URL ?? "http://localhost:3000"),
};

export const viewport: Viewport = { themeColor: "#ffffff", viewportFit: "cover" };

/** Root layout for the English website (/). */
export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${geist.variable} ${displayOnDemand.variable} ${bodyOnDemand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
