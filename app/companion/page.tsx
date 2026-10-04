import type { Metadata, Viewport } from "next";
import Companion from "@/components/Companion";
import { companion } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: companion.seo.title },
  description: companion.seo.description,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.brand,
    url: `${site.url}/companion/`,
    title: companion.seo.title,
    description: companion.seo.description,
  },
};

// Lets Android shrink the layout when the on-screen keyboard opens, so the
// pinned message input stays above it (iOS pans to the focused field itself).
export const viewport: Viewport = {
  themeColor: "#FAF9F5",
  interactiveWidget: "resizes-content",
};

export default function CompanionPage() {
  return <Companion />;
}
