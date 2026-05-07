import type { Metadata } from "next";
import { AuthGuard, SessionProvider } from "@/source/features/session";
import { getInitialSessionRole } from "@/source/features/session/server/getInitialSessionRole";
import { AppShell } from "@/source/widgets/app-shell";
import { CabinetMenuTabs } from "@/source/widgets/cabinet-menu-tabs";
import { SidebarMobileProvider } from "@/source/widgets/sidebar";

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
        <SidebarMobileProvider>
          <AppShell>{children}</AppShell>
          <CabinetMenuTabs />
        </SidebarMobileProvider>
      </AuthGuard>
    </SessionProvider>
  );
}
