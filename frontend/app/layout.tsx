import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import CabinetMenuTabs from "@/features/cabinet/menu-tabs/ui/CabinetMenuTabs";
import { SessionProvider } from "@/source/features/session";
import { AppShell } from "@/source/widgets/app-shell";
import { NotificationProvider } from "@/shared/ui/Notifications";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ресурс Плюс",
  description: "Экспертиза промышленной безопасности ОПО",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={montserrat.className}>
      <body className="antialiased">
        <NotificationProvider>
          <SessionProvider>
            <AppShell>{children}</AppShell>
            <CabinetMenuTabs />
          </SessionProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
