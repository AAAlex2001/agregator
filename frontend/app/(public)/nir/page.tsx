import type { Metadata } from "next";
import { LandingHeader, LandingFooter, LandingServiceSchema } from "@/source/widgets/landing";
import {
  NirLandingContent,
  NIR_COVER,
  NIR_FAQ,
  NIR_KEYWORDS,
  NIR_META_DESCRIPTION,
  NIR_TITLE,
} from "@/source/widgets/landing/nir";

export const metadata: Metadata = {
  title: NIR_TITLE,
  description: NIR_META_DESCRIPTION,
  keywords: NIR_KEYWORDS,
  alternates: { canonical: "/nir" },
  openGraph: {
    title: NIR_TITLE,
    description: NIR_META_DESCRIPTION,
    type: "website",
    url: "/nir",
    siteName: "Ресурс-Плюс",
    locale: "ru_RU",
    images: [
      {
        url: NIR_COVER,
        width: 1200,
        height: 630,
        alt: "НИРы и лабораторные исследования — Ресурс-Плюс",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: NIR_TITLE,
    description: NIR_META_DESCRIPTION,
    images: [NIR_COVER],
  },
  robots: { index: true, follow: true },
};

export default function NirLandingPage() {
  return (
    <>
      <NirLandingContent
        header={<LandingHeader />}
        footer={<LandingFooter variant="light" />}
      />
      <LandingServiceSchema
        name={NIR_TITLE}
        description={NIR_META_DESCRIPTION}
        path="/nir"
        serviceType="Научно-исследовательские работы и лабораторные исследования"
        faq={NIR_FAQ}
      />
    </>
  );
}
