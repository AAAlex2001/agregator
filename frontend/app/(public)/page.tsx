import type { Metadata } from "next";
import { MAIN_PAGE_TITLE, MAIN_PAGE_DESCRIPTION, MAIN_PAGE_KEYWORDS } from "@/source/shared/config/mainPageContent";
import {
  LandingHeader,
  LandingStructuredData,
  LandingSections,
  loadLandingPageData,
} from "@/source/widgets/landing";
import { RedirectIfAuthed } from "@/source/features/session";

export const metadata: Metadata = {
  title: MAIN_PAGE_TITLE,
  description: MAIN_PAGE_DESCRIPTION,
  keywords: MAIN_PAGE_KEYWORDS,
  alternates: { canonical: "/" },
  openGraph: {
    title: MAIN_PAGE_TITLE,
    description: MAIN_PAGE_DESCRIPTION,
    type: "website",
    url: "/",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Ресурс-Плюс" }],
  },
  twitter: {
    card: "summary_large_image",
    title: MAIN_PAGE_TITLE,
    description: MAIN_PAGE_DESCRIPTION,
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const data = await loadLandingPageData();

  return (
    <>
      <RedirectIfAuthed to="/landing" />
      <LandingStructuredData faq={data.snapshot.faq} />
      <LandingHeader />
      <LandingSections data={data} />
    </>
  );
}
