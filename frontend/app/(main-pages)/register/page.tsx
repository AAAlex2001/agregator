import type { Metadata } from "next";
import { RegisterWidget } from "@/source/widgets/auth/register";

export const metadata: Metadata = {
  title: "Регистрация | Ресурс Плюс",
  description: "Регистрация заказчика или эксперта на платформе Ресурс Плюс.",
  alternates: {
    canonical: "/register",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RegisterPage() {
  return <RegisterWidget />;
}
