import type { Metadata } from "next";
import { RequisitesWidget } from "@/source/widgets/requisites";

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
  return <RequisitesWidget />;
}
