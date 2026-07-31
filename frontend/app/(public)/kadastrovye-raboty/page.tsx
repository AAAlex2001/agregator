import type { Metadata } from "next";
import { LandingHeader, LandingFooter, LandingServiceSchema } from "@/source/widgets/landing";
import {
  KadastrLandingContent,
  KADASTR_COVER,
  KADASTR_FAQ,
  KADASTR_KEYWORDS,
  KADASTR_META_DESCRIPTION,
  KADASTR_TITLE,
} from "@/source/widgets/landing/kadastrovye-raboty";

export const metadata: Metadata = {
  title: KADASTR_TITLE,
  description: KADASTR_META_DESCRIPTION,
  keywords: KADASTR_KEYWORDS,
  alternates: { canonical: "/kadastrovye-raboty" },
  openGraph: {
    title: KADASTR_TITLE,
    description: KADASTR_META_DESCRIPTION,
    type: "website",
    url: "/kadastrovye-raboty",
    siteName: "Ресурс-Плюс",
    locale: "ru_RU",
    images: [
      {
        url: KADASTR_COVER,
        width: 1200,
        height: 630,
        alt: "Кадастровые работы — Ресурс-Плюс",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: KADASTR_TITLE,
    description: KADASTR_META_DESCRIPTION,
    images: [KADASTR_COVER],
  },
  robots: { index: true, follow: true },
};

export default function KadastrLandingPage() {
  return (
    <>
      <KadastrLandingContent
        header={<LandingHeader />}
        footer={<LandingFooter variant="light" />}
      />
      <LandingServiceSchema
        name={KADASTR_TITLE}
        description={KADASTR_META_DESCRIPTION}
        path="/kadastrovye-raboty"
        serviceType="Кадастровые работы"
        faq={KADASTR_FAQ}
      />
    </>
  );
}
