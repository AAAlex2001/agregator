import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LandingHeader, LandingHeaderAuthed, LandingFooter } from "@/source/widgets/landing";
import { PublicOrdersWidget } from "@/source/widgets/public-orders";
import {
  hasPublicOrderSearchCriteria,
  mapApiToOrderCard,
  parsePublicOrderSearch,
} from "@/source/entities/order";
import { fetchPublicOrdersServer } from "@/source/entities/order/api/public-orders.server";
import { getInitialSessionRole } from "@/source/features/session/server/getInitialSessionRole";

export const dynamic = "force-dynamic";

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

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PublicOrdersPage({ searchParams }: PageProps) {
  const filters = parsePublicOrderSearch(await searchParams);
  const hasSearchCriteria = hasPublicOrderSearchCriteria(filters);

  const role = await getInitialSessionRole();
  if (!hasSearchCriteria) {
    if (role === "EXPERT") redirect("/expert/orders");
    if (role === "CUSTOMER") redirect("/customer/orders");
    if (role) redirect("/landing");
  }

  const data = await fetchPublicOrdersServer(0, 50, filters);
  const initial = { items: data.items.map(mapApiToOrderCard), hasMore: data.has_more };

  return (
    <>
      {role ? <LandingHeaderAuthed /> : <LandingHeader />}
      <main>
        <PublicOrdersWidget initial={initial} filters={filters} />
      </main>
      <LandingFooter variant="light" />
    </>
  );
}
