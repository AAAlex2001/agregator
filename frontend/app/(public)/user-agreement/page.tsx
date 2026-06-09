import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { UserAgreementWidget } from "@/source/widgets/user-agreement";
import { RedirectIfAuthed } from "@/source/features/session";

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
  return (
    <>
      <RedirectIfAuthed to="/landing/user-agreement" />
      <LandingHeader />
      <UserAgreementWidget />
      <LandingFooter />
    </>
  );
}
