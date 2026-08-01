import type { Metadata } from "next";
import { LandingHeader, LandingFooter, LandingServiceSchema } from "@/source/widgets/landing";
import {
  AuditLandingContent,
  AUDIT_COVER,
  AUDIT_FAQ,
  AUDIT_KEYWORDS,
  AUDIT_META_DESCRIPTION,
  AUDIT_TITLE,
} from "@/source/widgets/landing/audit-supb";

export const metadata: Metadata = {
  title: AUDIT_TITLE,
  description: AUDIT_META_DESCRIPTION,
  keywords: AUDIT_KEYWORDS,
  alternates: { canonical: "/audit-supb" },
  openGraph: {
    title: AUDIT_TITLE,
    description: AUDIT_META_DESCRIPTION,
    type: "website",
    url: "/audit-supb",
    siteName: "Ресурс-Плюс",
    locale: "ru_RU",
    images: [
      {
        url: AUDIT_COVER,
        width: 1200,
        height: 630,
        alt: "Аудит СУПБ — Ресурс-Плюс",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: AUDIT_TITLE,
    description: AUDIT_META_DESCRIPTION,
    images: [AUDIT_COVER],
  },
  robots: { index: true, follow: true },
};

export default function AuditSupbLandingPage() {
  return (
    <>
      <AuditLandingContent header={<LandingHeader />} footer={<LandingFooter variant="light" />} />
      <LandingServiceSchema
        name={AUDIT_TITLE}
        description={AUDIT_META_DESCRIPTION}
        path="/audit-supb"
        serviceType="Аудит системы управления промышленной безопасностью"
        faq={AUDIT_FAQ}
      />
    </>
  );
}
