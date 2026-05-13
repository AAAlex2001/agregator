import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { PublicOrdersWidget } from "@/source/widgets/public-orders";
import { RedirectIfAuthed } from "@/source/features/session";

export const metadata: Metadata = {
  title: "Тендеры на экспертизу промышленной безопасности — открытые заявки",
  description:
    "Актуальные тендеры на экспертизу промышленной безопасности ОПО: зданий, сооружений, технических устройств и документации. Откликайтесь как аттестованный эксперт Ростехнадзора.",
  keywords: [
    "тендеры на экспертизу промышленной безопасности",
    "заказы экспертизы ОПО",
    "ЭПБ заявки",
    "найти работу эксперт промышленной безопасности",
    "тендер Ростехнадзор",
  ],
  alternates: { canonical: "/orders" },
  openGraph: {
    title: "Тендеры на экспертизу промышленной безопасности",
    description:
      "Открытые тендеры на ЭПБ зданий, сооружений, технических устройств и документации опасных производственных объектов.",
    url: "/orders",
    type: "website",
  },
  robots: { index: true, follow: true },
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
