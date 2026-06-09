import type { Metadata } from "next";
import { LoginWidget } from "@/source/widgets/auth/login";

export const metadata: Metadata = {
  title: "Вход в личный кабинет",
  description:
    "Вход в личный кабинет заказчика или эксперта Ростехнадзора на платформе экспертизы промышленной безопасности.",
  alternates: { canonical: "/login" },
  robots: { index: true, follow: true },
};

export default function LoginPage() {
  return <LoginWidget />;
}
