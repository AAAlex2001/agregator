import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthGuard } from "@/source/entities/session";
import { NotificationsWelcomeModal } from "@/source/features/notifications/welcome";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Открывает личные страницы только после проверки сессии. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      {children}
      <NotificationsWelcomeModal />
    </AuthGuard>
  );
}
