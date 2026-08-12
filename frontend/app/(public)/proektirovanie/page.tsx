import type { Metadata } from "next";
import { LandingHeader, LandingFooter, LandingServiceSchema } from "@/source/widgets/landing";
import {
  DesignLandingContent,
  DESIGN_COVER,
  DESIGN_FAQ,
  DESIGN_KEYWORDS,
  DESIGN_META_DESCRIPTION,
  DESIGN_TITLE,
} from "@/source/widgets/landing/proektirovanie";

export const metadata: Metadata = {
  title: DESIGN_TITLE,
  description: DESIGN_META_DESCRIPTION,
  keywords: DESIGN_KEYWORDS,
  alternates: { canonical: "/proektirovanie" },
  openGraph: {
    title: DESIGN_TITLE,
    description: DESIGN_META_DESCRIPTION,
    type: "website",
    url: "/proektirovanie",
    siteName: "Ресурс-Плюс",
    locale: "ru_RU",
    images: [
      {
        url: DESIGN_COVER,
        width: 1200,
        height: 630,
        alt: "Проектирование промышленных и гражданских объектов — Ресурс-Плюс",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DESIGN_TITLE,
    description: DESIGN_META_DESCRIPTION,
    images: [DESIGN_COVER],
  },
  robots: { index: true, follow: true },
};

export default function DesignLandingPage() {
  return (
    <>
      <DesignLandingContent
        header={<LandingHeader />}
        footer={<LandingFooter variant="light" />}
      />
      <LandingServiceSchema
        name={DESIGN_TITLE}
        description={DESIGN_META_DESCRIPTION}
        path="/proektirovanie"
        serviceType="Проектирование промышленных и гражданских объектов"
        faq={DESIGN_FAQ}
      />
    </>
  );
}
