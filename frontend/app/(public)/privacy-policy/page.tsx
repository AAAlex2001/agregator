import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { PrivacyPolicyWidget } from "@/source/widgets/privacy-policy";
import { RedirectIfAuthed } from "@/source/features/session";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Ресурс Плюс",
  description:
    "Политика конфиденциальности сайта plus-resurs.com — какие персональные данные собирает ООО «НПИ «Недра», как они обрабатываются и защищаются, ваши права.",
  alternates: {
    canonical: "/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <RedirectIfAuthed to="/landing/privacy-policy" />
      <LandingHeader />
      <PrivacyPolicyWidget />
      <LandingFooter variant="light" />
    </>
  );
}
