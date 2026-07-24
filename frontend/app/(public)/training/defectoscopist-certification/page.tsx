import type { Metadata } from "next";
import { LandingFooter, LandingHeader } from "@/source/widgets/landing";
import { DefectoscopistCertificationWidget } from "@/source/widgets/defectoscopist-certification";

export const metadata: Metadata = {
  title: "Аттестация и обучение дефектоскопистов в ООО «АРЦ НК»",
  description:
    "Подготовка, аттестация и сертификация дефектоскопистов и специалистов неразрушающего контроля на базе ООО «АРЦ НК». Форматы обучения, программы и контакты центра.",
  keywords: [
    "аттестация дефектоскопистов",
    "обучение дефектоскопистов",
    "ООО АРЦ НК",
    "аттестация специалистов НК",
    "сертификация персонала НК",
    "ГОСТ Р ИСО 9712-2023",
    "аттестация лабораторий НК",
    "неразрушающий контроль",
  ],
  alternates: { canonical: "/training/defectoscopist-certification" },
  openGraph: {
    title: "Аттестация и обучение дефектоскопистов в ООО «АРЦ НК»",
    description:
      "Программы подготовки, аттестации и сертификации специалистов неразрушающего контроля.",
    url: "/training/defectoscopist-certification",
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Аттестация и обучение дефектоскопистов",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Аттестация и обучение дефектоскопистов в ООО «АРЦ НК»",
    description:
      "Программы подготовки, аттестации и сертификации специалистов неразрушающего контроля.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function DefectoscopistCertificationPage() {
  return (
    <>
      <LandingHeader />
      <DefectoscopistCertificationWidget />
      <LandingFooter variant="light" />
    </>
  );
}
