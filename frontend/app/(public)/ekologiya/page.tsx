import type { Metadata } from "next";
import { LandingHeader, LandingFooter, LandingServiceSchema } from "@/source/widgets/landing";
import {
  EcologyLandingContent,
  ECOLOGY_COVER,
  ECOLOGY_FAQ,
  ECOLOGY_KEYWORDS,
  ECOLOGY_META_DESCRIPTION,
  ECOLOGY_TITLE,
} from "@/source/widgets/landing/ekologiya";

export const metadata: Metadata = {
  title: ECOLOGY_TITLE,
  description: ECOLOGY_META_DESCRIPTION,
  keywords: ECOLOGY_KEYWORDS,
  alternates: { canonical: "/ekologiya" },
  openGraph: {
    title: ECOLOGY_TITLE,
    description: ECOLOGY_META_DESCRIPTION,
    type: "website",
    url: "/ekologiya",
    siteName: "Ресурс-Плюс",
    locale: "ru_RU",
    images: [
      {
        url: ECOLOGY_COVER,
        width: 1200,
        height: 630,
        alt: "Экологическое сопровождение предприятий — Ресурс-Плюс",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ECOLOGY_TITLE,
    description: ECOLOGY_META_DESCRIPTION,
    images: [ECOLOGY_COVER],
  },
  robots: { index: true, follow: true },
};

export default function EcologyLandingPage() {
  return (
    <>
      <EcologyLandingContent
        header={<LandingHeader />}
        footer={<LandingFooter variant="light" />}
      />
      <LandingServiceSchema
        name={ECOLOGY_TITLE}
        description={ECOLOGY_META_DESCRIPTION}
        path="/ekologiya"
        serviceType="Экологическое сопровождение предприятий"
        faq={ECOLOGY_FAQ}
      />
    </>
  );
}
