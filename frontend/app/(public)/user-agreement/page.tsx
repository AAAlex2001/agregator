import type { Metadata } from "next";
import { UserAgreementWidget } from "@/source/widgets/user-agreement";

export const metadata: Metadata = {
  title: "Пользовательское соглашение — Ресурс Плюс",
  description: "Пользовательское соглашение сайта plus-resurs.com — условия использования сервиса.",
  alternates: {
    canonical: "/user-agreement",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function UserAgreementPage() {
  return <UserAgreementWidget />;
}
