import type { Metadata } from "next";
import { ForgotPasswordWidget } from "@/source/widgets/auth/forgot-password";

export const metadata: Metadata = {
  title: "Восстановление пароля",
  description: "Страница восстановления доступа к аккаунту Ресурс-Плюс.",
  alternates: {
    canonical: "/forgot-password",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordWidget />;
}
