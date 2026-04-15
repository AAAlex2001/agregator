"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChatHeaderIcon,
  LogoIcon,
  LogoMarkIcon,
  NotificationsHeaderIcon,
  ProfileHeaderIcon,
} from "@/shared/ui/icons";
import { getRole } from "@/source/shared/lib/getRole";
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

const CHAT: Record<string, string> = {
  CUSTOMER: "/customer/chat",
  EXPERT: "/expert/chat",
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const key = getRole(pathname);
  const links = NAV[key];
  const chatHref = CHAT[key];

  return (
    <header className={s.header}>
      <div className={s.container}>
        <Link href="/settings" className={s.logo}>
          <span className={s.logoMobile}><LogoMarkIcon /></span>
          <span className={s.logoDesktop}><LogoIcon /></span>
        </Link>

        <nav className={s.nav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? s.navActive : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={s.actions}>
          <button
            className={s.iconBtn}
            type="button"
            aria-label="Чат"
            onClick={() => router.push(chatHref)}
          >
            <ChatHeaderIcon />
          </button>
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
