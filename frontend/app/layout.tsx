import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { SessionProvider } from "@/source/features/session";
import { getInitialSessionRole } from "@/source/features/session/server/getInitialSessionRole";
import { AppShell } from "@/source/widgets/app-shell";
import { CabinetMenuTabs } from "@/source/widgets/cabinet-menu-tabs";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialRole = await getInitialSessionRole();

  return (
    <html lang="ru" className={montserrat.className}>
      <body className="antialiased">
        <NotificationProvider>
          <SessionProvider initialRole={initialRole}>
            <AppShell>{children}</AppShell>
            <CabinetMenuTabs />
          </SessionProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
