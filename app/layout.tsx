// Root layout: fonts, theme without flash, base metadata.
import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { Intro } from "@/components/Intro";
import "@/styles/globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--font-display" });
const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Fact Cookie: Verify. Discover. Trust.",
  description: "Check every AI answer against live sources. See the evidence, get the corrected answer.",
};

// Runs before paint so the saved theme never flashes. Light is the default.
const themeScript = `try{if(sessionStorage.getItem('intro')==='1')document.documentElement.dataset.intro='seen'}catch(e){}try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body><Intro />{children}</body>
    </html>
  );
}
