import type { Metadata } from "next";
import { PublicOrdersWidget } from "@/source/widgets/public-orders";

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
  return <PublicOrdersWidget />;
}
