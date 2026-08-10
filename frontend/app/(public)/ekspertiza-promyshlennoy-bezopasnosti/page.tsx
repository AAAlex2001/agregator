import type { Metadata } from "next";
import { loadLandingSnapshot } from "@/source/entities/landing";
import { LandingHeader, LandingFooter, LandingServiceSchema } from "@/source/widgets/landing";
import {
  ExpertiseLandingContent,
  EXPERTISE_COVER,
  EXPERTISE_FAQ,
  EXPERTISE_KEYWORDS,
  EXPERTISE_META_DESCRIPTION,
  EXPERTISE_TITLE,
} from "@/source/widgets/landing/expertise";

export const metadata: Metadata = {
  title: EXPERTISE_TITLE,
  description: EXPERTISE_META_DESCRIPTION,
  keywords: EXPERTISE_KEYWORDS,
  alternates: { canonical: "/ekspertiza-promyshlennoy-bezopasnosti" },
  openGraph: {
    title: EXPERTISE_TITLE,
    description: EXPERTISE_META_DESCRIPTION,
    type: "website",
    url: "/ekspertiza-promyshlennoy-bezopasnosti",
    siteName: "Ресурс-Плюс",
    locale: "ru_RU",
    images: [
      {
        url: EXPERTISE_COVER,
        width: 1200,
        height: 630,
        alt: "Экспертиза промышленной безопасности — Ресурс-Плюс",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: EXPERTISE_TITLE,
    description: EXPERTISE_META_DESCRIPTION,
    images: [EXPERTISE_COVER],
  },
  robots: { index: true, follow: true },
};

export default async function ExpertiseLandingPage() {
  const snapshot = await loadLandingSnapshot();

  return (
    <>
      <ExpertiseLandingContent
        snapshot={snapshot}
        header={<LandingHeader />}
        footer={<LandingFooter variant="light" />}
      />
      <LandingServiceSchema
        name={EXPERTISE_TITLE}
        description={EXPERTISE_META_DESCRIPTION}
        path="/ekspertiza-promyshlennoy-bezopasnosti"
        serviceType="Экспертиза промышленной безопасности"
        faq={EXPERTISE_FAQ}
      />
    </>
  );
}
