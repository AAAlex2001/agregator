import type { Metadata } from "next";
import { RegisterWidget } from "@/source/widgets/auth/register";

export const metadata: Metadata = {
  title: "Регистрация на платформе экспертизы промышленной безопасности",
  description:
    "Регистрация заказчика или эксперта Ростехнадзора на платформе тендеров по экспертизе промышленной безопасности опасных производственных объектов.",
  keywords: [
    "регистрация эксперт промышленной безопасности",
    "регистрация заказчика экспертизы ОПО",
    "стать экспертом Ростехнадзора",
  ],
  alternates: { canonical: "/register" },
  robots: { index: true, follow: true },
};

export default function RegisterPage() {
  return <RegisterWidget />;
}
