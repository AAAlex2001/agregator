import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchOrdersOnServer, ORDERS_PAGE_SIZE } from "@/source/entities/order";
import { readSessionRole } from "@/source/entities/session/server";
import { LandingFooter, LandingHeader } from "@/source/widgets/landing";
import { PublicOrdersWidget } from "@/source/widgets/orders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Тендеры на экспертизу промышленной безопасности — открытые заявки",
  description:
    "Актуальные тендеры на экспертизу промышленной безопасности ОПО: зданий, сооружений, технических устройств и документации. Откликайтесь как аттестованный исполнитель Ростехнадзора.",
  keywords: [
    "тендеры на экспертизу промышленной безопасности",
    "заказы экспертизы ОПО",
    "ЭПБ заявки",
    "найти работу исполнитель промышленной безопасности",
    "тендер Ростехнадзор",
  ],
  alternates: { canonical: "/orders" },
  openGraph: {
    title: "Тендеры на экспертизу промышленной безопасности",
    description: "Открытые тендеры на ЭПБ зданий, сооружений, технических устройств и документации опасных производственных объектов.",
    url: "/orders",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Ресурс-Плюс" }],
  },
  robots: { index: true, follow: true },
};

export default async function PublicOrdersPage() {
  const role = await readSessionRole();
  if (role === "EXPERT") redirect("/expert/orders");
  if (role === "CUSTOMER") redirect("/customer/orders");
  if (role) redirect("/landing");

  const initial = await fetchOrdersOnServer({ skip: 0, limit: ORDERS_PAGE_SIZE });

  return (
    <>
      <LandingHeader />
      <main>
        <PublicOrdersWidget initial={initial} />
      </main>
      <LandingFooter variant="light" />
    </>
  );
}
