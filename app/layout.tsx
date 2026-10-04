import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MobileCtaBar from "@/components/MobileCtaBar";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-fraunces",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`${site.url}/`),
  title: site.brand,
  applicationName: site.brand,
  // STAGING PROTECTION — never remove (see CLAUDE.md).
  robots: { index: false, follow: false },
  formatDetection: { telephone: false },
  // TODO: no favicon asset supplied; empty icon avoids a 404 until one is.
  icons: { icon: "data:," },
};

export const viewport: Viewport = {
  themeColor: "#FAF9F5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${figtree.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables the fade-in only when JS runs, so nothing is hidden without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <MobileCtaBar />
        <Reveal />
      </body>
    </html>
  );
}
