import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ToastProvider } from "@/shared/ui/toaster";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Панель управления — Ресурс-Плюс",
  robots: { index: false, follow: false, nocache: true },
};

/** Общая оболочка админки: шрифты, тема и уведомления. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
