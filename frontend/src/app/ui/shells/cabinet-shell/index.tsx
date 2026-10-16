"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { ChatListProvider } from "@/entities/chat";
import { UnreadCountProvider } from "@/entities/notification";
import { useUser } from "@/entities/user";
import { CabinetHeader } from "@/widgets/cabinet-header";
import { CabinetMenuTabs } from "@/widgets/cabinet-menu-tabs";
import { LicenseHoldersDrawer } from "@/widgets/license-holders-drawer";
import { Sidebar } from "@/widgets/sidebar";
import { hasCabinetSidebar } from "../../../config/cabinet-routes";
import { CabinetPage } from "../cabinet-page";
import styles from "./style.module.scss";

/** Страница кабинета или публикаций. */
interface CabinetShellProps {
  children: ReactNode;
}

/**
 * Держит шапку, меню и счётчики кабинета при переходах между страницами.
 * Мобильное меню помнит адрес, на котором его открыли, и закрывается при переходе.
 */
export function CabinetShell({ children }: CabinetShellProps) {
  const pathname = usePathname();
  const { role } = useUser();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [isLicenseHoldersOpen, setIsLicenseHoldersOpen] = useState(false);

  /** Показывает мобильное меню поверх текущей страницы. */
  function openMenu() {
    setMenuPath(pathname);
  }

  /** Скрывает мобильное меню. */
  function closeMenu() {
    setMenuPath(null);
  }

  /** Показывает каталог держателей в нижней панели. */
  function openLicenseHolders() {
    setIsLicenseHoldersOpen(true);
  }

  /** Скрывает каталог держателей. */
  function closeLicenseHolders() {
    setIsLicenseHoldersOpen(false);
  }

  if (!role) {
    return children;
  }

  return (
    <UnreadCountProvider role={role}>
      <ChatListProvider role={role}>
        <div className={styles.root}>
          {hasCabinetSidebar(pathname) ? (
            <div className={styles.layout}>
              <CabinetHeader />
              <div className={styles.body}>
                <Sidebar
                  isOpen={menuPath === pathname}
                  onClose={closeMenu}
                />
                <main className={styles.content}>
                  <CabinetPage>{children}</CabinetPage>
                </main>
              </div>
            </div>
          ) : (
            <>
              <CabinetHeader />
              <CabinetPage>{children}</CabinetPage>
            </>
          )}
        </div>
        <CabinetMenuTabs
          onOpenMenu={openMenu}
          onOpenLicenseHolders={openLicenseHolders}
        />
        <LicenseHoldersDrawer
          isOpen={isLicenseHoldersOpen}
          onClose={closeLicenseHolders}
        />
      </ChatListProvider>
    </UnreadCountProvider>
  );
}
