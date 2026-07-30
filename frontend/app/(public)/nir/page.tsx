import type { Metadata } from "next";
import {
  LandingHeader,
  LandingServiceHero,
  LandingSearchBlock,
  LandingOtherDirections,
  LandingExpertsMap,
  LandingFooter,
} from "@/source/widgets/landing";
import {
  NirSeoText,
  NIR_BULLETS,
  NIR_COVER,
  NIR_KEYWORDS,
  NIR_META_DESCRIPTION,
  NIR_SUBTITLE,
  NIR_TITLE,
} from "@/source/widgets/landing/nir";
import { ServiceRequestForm } from "@/source/features/service-request";
import s from "./page.module.scss";

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
    <div className={s.page}>
      <LandingHeader />
      <main>
        <LandingServiceHero title={NIR_TITLE} subtitle={NIR_SUBTITLE} bullets={NIR_BULLETS}>
          <ServiceRequestForm />
        </LandingServiceHero>
        <LandingSearchBlock />
        <LandingExpertsMap />
        <NirSeoText />
        <LandingOtherDirections currentSlug="nir" />
      </main>
      <LandingFooter variant="light" />
    </div>
  );
}
