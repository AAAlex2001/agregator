"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/source/features/session";
import { UserAvatar } from "@/source/shared/ui/UserAvatar";
import {
  ChatHeaderIcon,
  LogoIcon,
  LogoMarkIcon,
  NotificationsHeaderIcon,
  ProfileHeaderIcon,
} from "@/source/shared/ui/icons";
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
  const { role, user } = useSession();

  const key = role;
  const links = key ? NAV[key] : [];
  const isChatActive = pathname === "/chat" || pathname.startsWith("/chat/");
  const isProfileActive = pathname === "/settings";

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
          <Link
            className={`${s.iconBtn} ${isChatActive ? s.iconBtnActive : ""}`.trim()}
            href="/chat"
            aria-label="Чат"
          >
            <ChatHeaderIcon />
          </Link>
          <button className={s.iconBtn} type="button" aria-label="Уведомления">
            <NotificationsHeaderIcon />
          </button>
          <Link
            href="/settings"
            className={`${s.iconBtn} ${user?.avatar_url ? s.avatarBtn : ""} ${isProfileActive ? s.iconBtnActive : ""}`.trim()}
            aria-label="Профиль"
          >
            {user?.avatar_url ? (
              <UserAvatar src={user.avatar_url} alt="Ваше фото" className={s.headerAvatar} />
            ) : (
              <ProfileHeaderIcon />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
