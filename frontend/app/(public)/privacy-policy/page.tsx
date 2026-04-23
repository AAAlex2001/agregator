import type { Metadata } from "next";
import { PrivacyPolicyWidget } from "@/source/widgets/privacy-policy";

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
  return <PrivacyPolicyWidget />;
}
