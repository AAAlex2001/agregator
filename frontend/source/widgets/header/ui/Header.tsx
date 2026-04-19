"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/source/features/session";
import { getRouteSessionRole } from "@/source/features/session/model/sessionRole";
import {
  ChatHeaderIcon,
  LogoIcon,
  LogoMarkIcon,
  NotificationsHeaderIcon,
  ProfileHeaderIcon,
} from "@/shared/ui/icons";
import s from "./Header.module.scss";

const NAV: Record<string, { href: string; label: string }[]> = {
  CUSTOMER: [
    { href: "/customer/orders", label: "Мои заказы" },
    { href: "/responses", label: "Отклики" },
  ],
  EXPERT: [
    { href: "/expert/orders", label: "Все заказы" },
    { href: "/responses", label: "Мои отклики" },
    { href: "/expert/reviews", label: "Отзывы" },
  ],
};

export function Header() {
  const pathname = usePathname();
  const { resolvedRole } = useSession();

  const key = getRouteSessionRole(pathname) ?? resolvedRole;
  const links = key ? NAV[key] : [];
  const placeholders = ["lg", "md", "sm"] as const;

  return (
    <header className={s.header}>
      <div className={s.container}>
        <Link href="/settings" className={s.logo}>
          <span className={s.logoMobile}><LogoMarkIcon /></span>
          <span className={s.logoDesktop}><LogoIcon /></span>
        </Link>

        <nav className={s.nav}>
          {links.length > 0
            ? links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? s.navActive : undefined}
              >
                {link.label}
              </Link>
            ))
            : placeholders.map((size) => (
              <span key={size} className={`${s.navPlaceholder} ${s[`navPlaceholder${size.toUpperCase()}`]}`.trim()} aria-hidden="true" />
            ))}
        </nav>

        <div className={s.actions}>
          <Link className={s.iconBtn} href="/chat" aria-label="Чат">
            <ChatHeaderIcon />
          </Link>
          <button className={s.iconBtn} type="button" aria-label="Уведомления">
            <NotificationsHeaderIcon />
          </button>
          <Link href="/settings" className={s.iconBtn} aria-label="Профиль">
            <ProfileHeaderIcon />
          </Link>
        </div>
      </div>
    </header>
  );
}
