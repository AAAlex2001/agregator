import type { Metadata } from "next";
import { LoginWidget } from "@/source/widgets/auth/login";

export const metadata: Metadata = {
  title: "Вход в личный кабинет | Ресурс Плюс",
  description: "Вход в аккаунт заказчика или эксперта на платформе Ресурс Плюс.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginPage() {
  return <LoginWidget />;
}
