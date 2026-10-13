"use client";

import cn from "classnames";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout, useSession } from "@/source/entities/session";
import { useUnreadCount } from "@/source/entities/notification";
import { CloseIcon, LogoIcon, LogoutIcon } from "@/source/shared/ui/icons";
import { SIDEBAR_SECTIONS } from "../model/navigation";
import { useSidebarMobile } from "../model/SidebarMobileContext";
import { RoleSwitcher } from "@/source/features/auth/switch-role";
import { SidebarLink } from "./SidebarLink";
import { SidebarProfile } from "./SidebarProfile";
import s from "./Sidebar.module.scss";

/** Постоянное меню кабинета на ПК и нижняя панель на телефоне. */
export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isLoading, setUser } = useSession();
  const { isOpen, close } = useSidebarMobile();
  const { count: unreadCount } = useUnreadCount();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const sections = role ? SIDEBAR_SECTIONS[role] : [];

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    await logout();
    close();
    setUser(null);
    router.replace("/");
  }

  return (
    <>
      <button
        type="button"
        className={cn(s.backdrop, { [s.backdropVisible]: isOpen })}
        onClick={close}
        aria-label="Закрыть меню кабинета"
        aria-hidden={!isOpen}
        tabIndex={-1}
      />
      <aside
        className={cn(s.sidebar, { [s.mobileOpen]: isOpen })}
        aria-label="Личный кабинет"
      >
        <div className={s.brand}>
          <Link href="/landing" className={s.logo} aria-label="На главную" onClick={close}>
            <LogoIcon />
          </Link>
          <button type="button" className={s.closeButton} onClick={close} aria-label="Закрыть меню">
            <CloseIcon />
          </button>
        </div>

        <div className={s.content}>
          <SidebarProfile user={user} isLoading={isLoading} onNavigate={close} />

          <nav className={s.nav} aria-label="Разделы кабинета">
            {sections.map((section) => (
              <div key={section.label} className={s.section}>
                <span className={s.sectionTitle}>{section.label}</span>
                {section.items.map((item) => (
                  <SidebarLink
                    key={item.href}
                    item={item}
                    active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                    badge={item.href === "/notifications" ? unreadCount : 0}
                    onNavigate={close}
                  />
                ))}
              </div>
            ))}
          </nav>

          <div className={s.bottom}>
            <RoleSwitcher />
            <button
              type="button"
              className={cn(s.tab, s.tabLogout)}
              disabled={isLoggingOut}
              onClick={() => void handleLogout()}
            >
              <span className={s.tabIcon} aria-hidden="true"><LogoutIcon /></span>
              <span className={s.tabLabel}>{isLoggingOut ? "Выходим…" : "Выйти"}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
