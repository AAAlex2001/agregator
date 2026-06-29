import type { Metadata } from "next";
import { AuthGuard, SessionProvider } from "@/source/features/session";
import { getInitialSessionRole } from "@/source/features/session/server/getInitialSessionRole";
import { AppShell } from "@/source/widgets/app-shell";
import { CabinetMenuTabs } from "@/source/widgets/cabinet-menu-tabs";
import { SidebarMobileProvider } from "@/source/widgets/sidebar";
import {
  LicenseHoldersDrawer,
  LicenseHoldersDrawerProvider,
} from "@/source/widgets/license-holders-drawer";
import { ExpertHelpDrawer, ExpertHelpProvider } from "@/source/widgets/expert-help";
import { UnreadCountProvider } from "@/source/features/notifications";
import { NotificationsWelcomeModal } from "@/source/features/onboarding/notifications-welcome";
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
  const initialRole = await getInitialSessionRole();

  return (
    <SessionProvider initialRole={initialRole}>
      <AuthGuard>
        <UnreadCountProvider>
          <SidebarMobileProvider>
            <LicenseHoldersDrawerProvider>
              <ExpertHelpProvider>
                <div className={s.root}>
                  <AppShell>{children}</AppShell>
                </div>
                <CabinetMenuTabs />
                <LicenseHoldersDrawer />
                <ExpertHelpDrawer />
                <NotificationsWelcomeModal />
              </ExpertHelpProvider>
            </LicenseHoldersDrawerProvider>
          </SidebarMobileProvider>
        </UnreadCountProvider>
      </AuthGuard>
    </SessionProvider>
  );
}
