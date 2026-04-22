import type { Metadata } from "next";
import { OfferWidget } from "@/source/widgets/offer";

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
  return <OfferWidget />;
}
