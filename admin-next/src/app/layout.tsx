import type { Metadata } from "next";
import { AdminNav } from "@/widgets/admin-nav/AdminNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Панель управления",
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="shell">
          <AdminNav />
          <div className="shell-content">{children}</div>
        </div>
      </body>
    </html>
  );
}
