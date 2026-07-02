import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { PersonalDataConsentWidget } from "@/source/widgets/personal-data-consent";
import { RedirectIfAuthed } from "@/source/features/session";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных — Ресурс-Плюс",
  description:
    "Согласие пользователя сайта plus-resurs.com на обработку персональных данных ООО «НПИ «Недра» в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».",
  alternates: {
    canonical: "/personal-data-consent",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PersonalDataConsentPage() {
  return (
    <>
      <RedirectIfAuthed to="/landing/personal-data-consent" />
      <LandingHeader />
      <PersonalDataConsentWidget />
      <LandingFooter variant="light" />
    </>
  );
}
