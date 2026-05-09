import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { OfferWidget } from "@/source/widgets/offer";
import { RedirectIfAuthed } from "@/source/features/session";

export const metadata: Metadata = {
  title: "Публичная оферта — Ресурс Плюс",
  description: "Публичная оферта ООО «НПИ «Недра» на предоставление услуг сервиса Ресурс-Плюс.",
  alternates: {
    canonical: "/offer",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OfferPage() {
  return (
    <>
      <RedirectIfAuthed to="/landing/offer" />
      <LandingHeader />
      <OfferWidget />
      <LandingFooter variant="light" />
    </>
  );
}
