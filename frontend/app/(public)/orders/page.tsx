import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { PublicOrdersWidget } from "@/source/widgets/public-orders";
import { RedirectIfAuthed } from "@/source/features/session";

export const metadata: Metadata = {
  title: "Актуальные заявки | Ресурс Плюс",
  description: "Открытые заявки на платформе. Войдите или зарегистрируйтесь, чтобы откликаться.",
  alternates: {
    canonical: "/orders",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PublicOrdersPage() {
  return (
    <>
      <RedirectIfAuthed
        to={{ EXPERT: "/expert/orders", CUSTOMER: "/customer/orders" }}
        fallback="/landing"
      />
      <LandingHeader />
      <PublicOrdersWidget />
      <LandingFooter variant="light" />
    </>
  );
}
