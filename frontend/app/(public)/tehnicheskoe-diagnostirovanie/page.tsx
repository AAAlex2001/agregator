import type { Metadata } from "next";
import { LandingHeader, LandingFooter, LandingServiceSchema } from "@/source/widgets/landing";
import {
  TechDiagLandingContent,
  TECH_DIAG_COVER,
  TECH_DIAG_FAQ,
  TECH_DIAG_KEYWORDS,
  TECH_DIAG_META_DESCRIPTION,
  TECH_DIAG_TITLE,
} from "@/source/widgets/landing/tech-diag";

export const metadata: Metadata = {
  title: TECH_DIAG_TITLE,
  description: TECH_DIAG_META_DESCRIPTION,
  keywords: TECH_DIAG_KEYWORDS,
  alternates: { canonical: "/tehnicheskoe-diagnostirovanie" },
  openGraph: {
    title: TECH_DIAG_TITLE,
    description: TECH_DIAG_META_DESCRIPTION,
    type: "website",
    url: "/tehnicheskoe-diagnostirovanie",
    siteName: "Ресурс-Плюс",
    locale: "ru_RU",
    images: [
      {
        url: TECH_DIAG_COVER,
        width: 1200,
        height: 630,
        alt: "Техническое освидетельствование и диагностирование — Ресурс-Плюс",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TECH_DIAG_TITLE,
    description: TECH_DIAG_META_DESCRIPTION,
    images: [TECH_DIAG_COVER],
  },
  robots: { index: true, follow: true },
};

export default function TechDiagLandingPage() {
  return (
    <>
      <TechDiagLandingContent
        header={<LandingHeader />}
        footer={<LandingFooter variant="light" />}
      />
      <LandingServiceSchema
        name={TECH_DIAG_TITLE}
        description={TECH_DIAG_META_DESCRIPTION}
        path="/tehnicheskoe-diagnostirovanie"
        serviceType="Техническое освидетельствование и техническое диагностирование"
        faq={TECH_DIAG_FAQ}
      />
    </>
  );
}
