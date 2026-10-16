"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUnreadCount } from "@/entities/notification";
import { homePath, useUser } from "@/entities/user";
import type { UserProfile } from "@/entities/user";
import { useLogout } from "@/features/logout";
import { RoleSwitcher } from "@/features/switch-role";
import { CloseIcon, LogoIcon } from "@/shared/ui/icons";
import { getSidebarSections } from "../../config/navigation";
import { SidebarLink } from "../sidebar-link";
import { SidebarLogout } from "../sidebar-logout";
import { SidebarProfile } from "../sidebar-profile";
import styles from "./style.module.scss";

/** Открыто ли меню на телефоне. */
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Постоянное меню кабинета на ПК и выезжающая панель на телефоне. */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role } = useUser();
  const { count: unreadCount } = useUnreadCount();
  const { isLoggingOut, logout } = useLogout(leaveCabinet);
  const sections = getSidebarSections(role);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const desktop = window.matchMedia("(min-width: 1440px)");

    /** Закрывает меню клавишей Escape. */
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    /** Закрывает мобильное меню при переходе к раскладке ПК. */
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [isOpen, onClose]);

  /** Уводит на публичную главную после выхода. */
  function leaveCabinet() {
    onClose();
    router.replace("/");
  }

  /** Открывает стартовую страницу новой роли. */
  function openRoleHome(nextUser: UserProfile) {
    onClose();
    router.push(homePath(nextUser.role));
  }

  return (
    <>
      <button
        type="button"
        className={cn(styles.backdrop, {
          [styles.backdropVisible]: isOpen,
        })}
        onClick={onClose}
        aria-label="Закрыть меню кабинета"
        aria-hidden={!isOpen}
        tabIndex={-1}
      />
      <aside
        className={cn(styles.sidebar, {
          [styles.mobileOpen]: isOpen,
        })}
        aria-label="Личный кабинет"
      >
        <div className={styles.brand}>
          <Link
            href="/landing"
            className={styles.logo}
            aria-label="На главную"
            onClick={onClose}
          >
            <LogoIcon />
          </Link>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть меню"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.content}>
          <SidebarProfile
            user={user}
            onNavigate={onClose}
          />

          <nav
            className={styles.nav}
            aria-label="Разделы кабинета"
          >
            {sections.map((section) => (
              <div
                key={section.label}
                className={styles.section}
              >
                <span className={styles.sectionTitle}>{section.label}</span>
                {section.items.map((item) => (
                  <SidebarLink
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    badge={item.href === "/notifications" ? unreadCount : 0}
                    onNavigate={onClose}
                  />
                ))}
              </div>
            ))}
          </nav>

          <div className={styles.bottom}>
            <RoleSwitcher onSwitched={openRoleHome} />
            <SidebarLogout
              isLoggingOut={isLoggingOut}
              onLogout={logout}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
