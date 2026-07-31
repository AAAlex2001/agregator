import type { Metadata } from "next";
import { LandingHeader, LandingFooter, LandingServiceSchema } from "@/source/widgets/landing";
import {
  ForensicLandingContent,
  FORENSIC_COVER,
  FORENSIC_FAQ,
  FORENSIC_KEYWORDS,
  FORENSIC_META_DESCRIPTION,
  FORENSIC_TITLE,
} from "@/source/widgets/landing/sudebnaya-ekspertiza";

export const metadata: Metadata = {
  title: FORENSIC_TITLE,
  description: FORENSIC_META_DESCRIPTION,
  keywords: FORENSIC_KEYWORDS,
  alternates: { canonical: "/sudebnaya-ekspertiza" },
  openGraph: {
    title: FORENSIC_TITLE,
    description: FORENSIC_META_DESCRIPTION,
    type: "website",
    url: "/sudebnaya-ekspertiza",
    siteName: "Ресурс-Плюс",
    locale: "ru_RU",
    images: [
      {
        url: FORENSIC_COVER,
        width: 1200,
        height: 630,
        alt: "Судебная экспертиза — Ресурс-Плюс",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: FORENSIC_TITLE,
    description: FORENSIC_META_DESCRIPTION,
    images: [FORENSIC_COVER],
  },
  robots: { index: true, follow: true },
};

export default function ForensicExpertiseLandingPage() {
  return (
    <>
      <ForensicLandingContent
        header={<LandingHeader />}
        footer={<LandingFooter variant="light" />}
      />
      <LandingServiceSchema
        name={FORENSIC_TITLE}
        description={FORENSIC_META_DESCRIPTION}
        path="/sudebnaya-ekspertiza"
        serviceType="Судебная экспертиза"
        faq={FORENSIC_FAQ}
      />
    </>
  );
}
