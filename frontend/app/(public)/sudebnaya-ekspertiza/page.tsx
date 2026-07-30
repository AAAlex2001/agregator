import type { Metadata } from "next";
import Image from "next/image";
import {
  LandingHeader,
  LandingServiceHero,
  LandingSearchBlock,
  LandingOtherDirections,
  LandingExpertsMap,
  LandingAudience,
  LandingServiceFaq,
  LandingServiceSchema,
  LandingFooter,
} from "@/source/widgets/landing";
import {
  ForensicCatalog,
  ForensicSeoText,
  FORENSIC_AUDIENCE,
  FORENSIC_BULLETS,
  FORENSIC_CLAIM,
  FORENSIC_COVER,
  FORENSIC_FAQ,
  FORENSIC_KEYWORDS,
  FORENSIC_META_DESCRIPTION,
  FORENSIC_SUBTITLE,
  FORENSIC_TITLE,
} from "@/source/widgets/landing/sudebnaya-ekspertiza";
import s from "./page.module.scss";

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
    <div className={s.page}>
      <LandingHeader />
      <main>
        <LandingServiceHero
          title={FORENSIC_TITLE}
          subtitle={FORENSIC_SUBTITLE}
          bullets={FORENSIC_BULLETS}
        >
          <div className={s.cover}>
            <div className={s.coverImage}>
              <Image
                src={FORENSIC_COVER}
                alt="Судебная экспертиза"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className={s.coverImg}
                priority
              />
            </div>
            <p className={s.coverClaim}>{FORENSIC_CLAIM}</p>
          </div>
        </LandingServiceHero>

        <ForensicCatalog />
        <LandingAudience blocks={FORENSIC_AUDIENCE} />
        <LandingSearchBlock />
        <LandingExpertsMap />
        <LandingServiceFaq
          items={FORENSIC_FAQ}
          subtitle="Кто вправе давать заключение для суда, кто оплачивает экспертизу и как оспорить её выводы."
        />
        <ForensicSeoText />
        <LandingOtherDirections currentSlug="sudebnaya-ekspertiza" />
      </main>
      <LandingFooter variant="light" />
      <LandingServiceSchema
        name={FORENSIC_TITLE}
        description={FORENSIC_META_DESCRIPTION}
        path="/sudebnaya-ekspertiza"
        serviceType="Судебная экспертиза"
        faq={FORENSIC_FAQ}
      />
    </div>
  );
}
