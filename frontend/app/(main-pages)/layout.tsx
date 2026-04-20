import { SessionProvider } from "@/source/features/session";
import { getInitialSessionRole } from "@/source/features/session/server/getInitialSessionRole";
import { AppShell } from "@/source/widgets/app-shell";
import { CabinetMenuTabs } from "@/source/widgets/cabinet-menu-tabs";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialRole = await getInitialSessionRole();

  return (
    <SessionProvider initialRole={initialRole}>
      <AppShell>{children}</AppShell>
      <CabinetMenuTabs />
    </SessionProvider>
  );
}