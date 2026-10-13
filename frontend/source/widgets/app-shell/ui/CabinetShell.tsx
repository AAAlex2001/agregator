"use client";

import type { ReactNode } from "react";
import { useSession } from "@/source/entities/session";
import { UnreadCountProvider } from "@/source/entities/notification";
import { ChatListProvider } from "@/source/features/chat";
import { SidebarMobileProvider } from "@/source/widgets/sidebar";
import { CabinetMenuTabs } from "@/source/widgets/cabinet-menu-tabs";
import {
  LicenseHoldersDrawer,
  LicenseHoldersDrawerProvider,
} from "@/source/widgets/license-holders-drawer";
import { AppShell } from "./AppShell";
import s from "./CabinetShell.module.scss";

/** Держит общую оболочку; сбрасывает данные только при смене роли или выходе. */
export function CabinetShell({ children }: { children: ReactNode }) {
  const { role } = useSession();
  if (!role) return children;

  return (
    <UnreadCountProvider key={role}>
      <ChatListProvider>
        <SidebarMobileProvider>
          <LicenseHoldersDrawerProvider>
            <div className={s.root}>
              <AppShell>{children}</AppShell>
            </div>
            <CabinetMenuTabs />
            <LicenseHoldersDrawer />
          </LicenseHoldersDrawerProvider>
        </SidebarMobileProvider>
      </ChatListProvider>
    </UnreadCountProvider>
  );
}
