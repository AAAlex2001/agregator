"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/source/features/session";
import { useUnreadNotificationCount } from "@/source/features/notifications";
import { logout } from "@/source/entities/user";
import {
  CollapseSidebarIcon,
  DangerIcon,
  ExpertRoomIcon,
  FileIcon,
  LiningIcon,
  LogoIcon,
  LogoMarkIcon,
  LogoutIcon,
  ReviewIcon,
  TabArchiveIcon,
  TabChatIcon,
  TabNotificationIcon,
  TabOrdersIcon,
  TabProfileIcon,
  TabResponsesIcon,
  TabSupportIcon,
} from "@/source/shared/ui/icons";
import { useSidebarMobile } from "../model/SidebarMobileContext";
import { RoleSwitcher } from "./RoleSwitcher";
import s from "./Sidebar.module.scss";

interface SidebarItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

const NAV: Record<"EXPERT" | "CUSTOMER" | "LICENSE_HOLDER", SidebarSection[]> = {
  EXPERT: [
    {
      label: "Работа",
      items: [
        { href: "/expert/orders", label: "Все заказы", icon: TabOrdersIcon },
        { href: "/responses", label: "Мои отклики", icon: TabResponsesIcon },
        { href: "/archive", label: "Архив", icon: TabArchiveIcon },
        { href: "/expert/hazard", label: "Оценка опасности", icon: DangerIcon },
        { href: "/expert/lining", label: "Оценка крепи", icon: LiningIcon },
      ],
    },
    {
      label: "Эксперты",
      items: [
        { href: "/expert-reviews", label: "Отзывы экспертов", icon: ReviewIcon },
      ],
    },
    {
      label: "Общение",
      items: [
        { href: "/chat", label: "Чат", icon: TabChatIcon },
        { href: "/expert/room", label: "Чат экспертов", icon: ExpertRoomIcon },
        { href: "/notifications", label: "Уведомления", icon: TabNotificationIcon },
        { href: "/support", label: "Поддержка", icon: TabSupportIcon },
      ],
    },
    {
      label: "Аккаунт",
      items: [
        { href: "/expert/reviews", label: "Мои отзывы", icon: ReviewIcon },
        { href: "/settings", label: "Профиль", icon: TabProfileIcon },
      ],
    },
  ],
  CUSTOMER: [
    {
      label: "Работа",
      items: [
        { href: "/customer/orders", label: "Мои заказы", icon: TabOrdersIcon },
        { href: "/responses", label: "Отклики", icon: TabResponsesIcon },
      ],
    },
    {
      label: "Результаты тендеров",
      items: [
        { href: "/archive", label: "Архив", icon: TabArchiveIcon },
        { href: "/customer/reports", label: "Отчёты", icon: FileIcon },
      ],
    },
    {
      label: "Эксперты",
      items: [
        { href: "/expert-reviews", label: "Отзывы экспертов", icon: ReviewIcon },
      ],
    },
    {
      label: "Общение",
      items: [
        { href: "/chat", label: "Чат", icon: TabChatIcon },
        { href: "/notifications", label: "Уведомления", icon: TabNotificationIcon },
        { href: "/support", label: "Поддержка", icon: TabSupportIcon },
      ],
    },
    {
      label: "Аккаунт",
      items: [
        { href: "/settings", label: "Профиль", icon: TabProfileIcon },
      ],
    },
  ],
  LICENSE_HOLDER: [
    {
      label: "Эксперты",
      items: [
        { href: "/expert-reviews", label: "Отзывы экспертов", icon: ReviewIcon },
      ],
    },
    {
      label: "Общение",
      items: [
        { href: "/notifications", label: "Уведомления", icon: TabNotificationIcon },
        { href: "/support", label: "Поддержка", icon: TabSupportIcon },
      ],
    },
    {
      label: "Аккаунт",
      items: [
        { href: "/settings", label: "Профиль", icon: TabProfileIcon },
      ],
    },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useSession();
  const mobile = useSidebarMobile();
  const unreadCount = useUnreadNotificationCount();
  const [collapsed, setCollapsed] = useState(true);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    setHoveredKey(null);
  }, [pathname]);

  const toggleCollapsed = () => {
    if (mobile.isOpen) {
      mobile.close();
      return;
    }
    setCollapsed((prev) => !prev);
  };

  const closeOverlay = () => {
    mobile.close();
    setCollapsed(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* ignore */
    }
    router.push("/login");
  };

  const HIDDEN_ON_MOBILE = new Set([
    "/expert/orders",
    "/customer/orders",
    "/responses",
    "/chat",
  ]);

  const baseSections = role ? NAV[role] : [];
  const sections = mobile.isOpen
    ? baseSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => !HIDDEN_ON_MOBILE.has(item.href)),
        }))
        .filter((section) => section.items.length > 0)
    : baseSections;
  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  const visualCollapsed = collapsed && !mobile.isOpen;
  const tipsOn = visualCollapsed;

  const renderTab = (
    key: string,
    label: string,
    Icon: ComponentType<{ className?: string }>,
    options: {
      active?: boolean;
      onClick?: () => void;
      href?: string;
      type?: "link" | "button";
      className?: string;
      badge?: number;
    },
  ) => {
    const tabClass = `${s.tab} ${options.active ? s.tabActive : ""} ${options.className ?? ""}`.trim();
    const badge = options.badge && options.badge > 0 ? options.badge : null;
    const badgeLabel = badge !== null && badge > 99 ? "99+" : badge;
    const inner = (
      <>
        <span className={s.tabIcon}>
          <Icon />
          {badge !== null && <span className={s.iconBadge}>{badgeLabel}</span>}
        </span>
        {!visualCollapsed && <span className={s.tabLabel}>{label}</span>}
      </>
    );

    const tooltipNode = tipsOn && hoveredKey === key
      ? <span className={s.tip}>{label}</span>
      : null;

    const wrapperHandlers = {
      onMouseEnter: () => setHoveredKey(key),
      onMouseLeave: () => setHoveredKey(null),
    };

    if (options.type === "button" || !options.href) {
      return (
        <span key={key} className={s.tipAnchor} {...wrapperHandlers}>
          <button type="button" className={tabClass} onClick={options.onClick}>
            {inner}
          </button>
          {tooltipNode}
        </span>
      );
    }
    return (
      <span key={key} className={s.tipAnchor} {...wrapperHandlers}>
        <Link href={options.href} className={tabClass} onClick={closeOverlay}>
          {inner}
        </Link>
        {tooltipNode}
      </span>
    );
  };

  return (
    <>
      <div
        className={`${s.backdrop} ${mobile.isOpen || !collapsed ? s.backdropVisible : ""}`.trim()}
        onClick={closeOverlay}
        aria-hidden="true"
      />
      <aside
        className={`${s.sidebar} ${visualCollapsed ? s.collapsed : ""} ${mobile.isOpen ? s.mobileOpen : ""}`.trim()}
        aria-label="Главное меню"
      >
        <Link href="/landing" className={s.logo} aria-label="На главную" onClick={closeOverlay}>
          {visualCollapsed ? <LogoMarkIcon /> : <LogoIcon />}
        </Link>

        <nav className={s.nav}>
          <div className={s.sections}>
            {sections.map((section) => (
              <section key={section.label} className={s.section}>
                {!visualCollapsed && <span className={s.sectionTitle}>{section.label}</span>}
                <div className={s.tabs}>
                  {section.items.map((item) =>
                    renderTab(item.href, item.label, item.icon, {
                      active: isActive(item.href),
                      href: item.href,
                      badge: item.href === "/notifications" ? unreadCount : undefined,
                    }),
                  )}
                </div>
              </section>
            ))}
          </div>

          <div className={s.bottom}>
            {!visualCollapsed && <RoleSwitcher />}

            {renderTab(
              "collapse",
              visualCollapsed ? "Развернуть" : "Скрыть панель",
              CollapseSidebarIcon,
              { type: "button", onClick: toggleCollapsed, className: s.tabCollapse },
            )}

            {renderTab("logout", "Выйти", LogoutIcon, {
              type: "button",
              onClick: handleLogout,
              className: s.tabLogout,
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
