import type { Metadata } from "next";
import Image from "next/image";
import {
  LandingHeader,
  LandingServiceHero,
  LandingSearchBlock,
  LandingOtherDirections,
  LandingExpertsMap,
  LandingAudience,
  LandingFooter,
} from "@/source/widgets/landing";
import {
  KadastrSeoText,
  KadastrServices,
  KADASTR_AUDIENCE,
  KADASTR_BULLETS,
  KADASTR_COVER,
  KADASTR_KEYWORDS,
  KADASTR_META_DESCRIPTION,
  KADASTR_SUBTITLE,
  KADASTR_TITLE,
} from "@/source/widgets/landing/kadastrovye-raboty";
import s from "./page.module.scss";

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
    <div className={s.page}>
      <LandingHeader />
      <main>
        <LandingServiceHero
          title={KADASTR_TITLE}
          subtitle={KADASTR_SUBTITLE}
          bullets={KADASTR_BULLETS}
        >
          <div className={s.cover}>
            <div className={s.coverImage}>
              <Image
                src={KADASTR_COVER}
                alt="Кадастровые работы"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className={s.coverImg}
                priority
              />
            </div>
            <p className={s.coverClaim}>Кадастровые инженеры из СРО — по всей России</p>
          </div>
        </LandingServiceHero>

        <KadastrServices />
        <LandingAudience blocks={KADASTR_AUDIENCE} />
        <LandingSearchBlock />
        <LandingExpertsMap />
        <KadastrSeoText />
        <LandingOtherDirections currentSlug="kadastrovye-raboty" />
      </main>
      <LandingFooter variant="light" />
    </div>
  );
}
