import type { Metadata } from "next";
import { LandingHeader, LandingFooter, LandingServiceSchema } from "@/source/widgets/landing";
import {
  SurveyLandingContent,
  SURVEY_COVER,
  SURVEY_FAQ,
  SURVEY_KEYWORDS,
  SURVEY_META_DESCRIPTION,
  SURVEY_TITLE,
} from "@/source/widgets/landing/izyskaniya";

export const metadata: Metadata = {
  title: SURVEY_TITLE,
  description: SURVEY_META_DESCRIPTION,
  keywords: SURVEY_KEYWORDS,
  alternates: { canonical: "/inzhenernye-izyskaniya" },
  openGraph: {
    title: SURVEY_TITLE,
    description: SURVEY_META_DESCRIPTION,
    type: "website",
    url: "/inzhenernye-izyskaniya",
    siteName: "Ресурс-Плюс",
    locale: "ru_RU",
    images: [
      {
        url: SURVEY_COVER,
        width: 1200,
        height: 630,
        alt: "Инженерные изыскания — Ресурс-Плюс",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SURVEY_TITLE,
    description: SURVEY_META_DESCRIPTION,
    images: [SURVEY_COVER],
  },
  robots: { index: true, follow: true },
};

export default function SurveyLandingPage() {
  return (
    <>
      <SurveyLandingContent
        header={<LandingHeader />}
        footer={<LandingFooter variant="light" />}
      />
      <LandingServiceSchema
        name={SURVEY_TITLE}
        description={SURVEY_META_DESCRIPTION}
        path="/inzhenernye-izyskaniya"
        serviceType="Инженерные изыскания"
        faq={SURVEY_FAQ}
      />
    </>
  );
}
