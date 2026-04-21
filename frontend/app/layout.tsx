import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { SITE_URL } from "@/source/shared/api/config";
import { NotificationProvider } from "@/shared/ui/Notifications";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ресурс Плюс",
  description: "Экспертиза промышленной безопасности ОПО",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={montserrat.className}>
      <body className="antialiased">
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
