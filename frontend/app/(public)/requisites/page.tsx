import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { RequisitesWidget } from "@/source/widgets/requisites";
import { RedirectIfAuthed } from "@/source/features/session";

export const metadata: Metadata = {
  title: "Реквизиты компании — Ресурс Плюс",
  description: "Официальные реквизиты ООО «НПИ «Недра»: ИНН, ОГРН, банковские реквизиты, лицензии.",
  alternates: {
    canonical: "/requisites",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RequisitesPage() {
  return (
    <>
      <RedirectIfAuthed to="/landing/requisites" />
      <LandingHeader />
      <RequisitesWidget />
      <LandingFooter variant="light" />
    </>
  );
}
