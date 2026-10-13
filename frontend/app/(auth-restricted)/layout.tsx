import type { Metadata } from "next";
import { AuthGuard, SessionProvider } from "@/source/entities/session";
import { readSessionRole } from "@/source/entities/session/server";
import { AppShell } from "@/source/widgets/app-shell";
import { CabinetMenuTabs } from "@/source/widgets/cabinet-menu-tabs";
import { SidebarMobileProvider } from "@/source/widgets/sidebar";
import {
  LicenseHoldersDrawer,
  LicenseHoldersDrawerProvider,
} from "@/source/widgets/license-holders-drawer";
import { UnreadCountProvider } from "@/source/entities/notification";
import { ChatListProvider } from "@/source/features/chat";
import { NotificationsWelcomeModal } from "@/source/features/notifications/welcome";
import { AuthModalProvider } from "@/source/shared/lib/auth-modal";
import { AuthModalHost } from "@/source/widgets/auth/auth-modal";
import s from "./layout.module.scss";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialRole = await readSessionRole();

  return (
    <SessionProvider initialRole={initialRole}>
      <AuthGuard>
        <AuthModalProvider>
          <UnreadCountProvider>
            <ChatListProvider>
              <SidebarMobileProvider>
                <LicenseHoldersDrawerProvider>
                  <div className={s.root}>
                    <AppShell>{children}</AppShell>
                  </div>
                  <CabinetMenuTabs />
                  <LicenseHoldersDrawer />
                  <NotificationsWelcomeModal />
                  <AuthModalHost />
                </LicenseHoldersDrawerProvider>
              </SidebarMobileProvider>
            </ChatListProvider>
          </UnreadCountProvider>
        </AuthModalProvider>
      </AuthGuard>
    </SessionProvider>
  );
}
