"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/source/features/session";
import {
  LogoIcon,
  LogoMarkIcon,
  NotificationsHeaderIcon,
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

export function AuthHeader() {
  const pathname = usePathname();
  const { role } = useSession();
  const links = role ? NAV[role] : [];

  return (
    <>
      <div className={s.spacer} aria-hidden="true" />
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
          <button className={s.iconBtn} type="button" aria-label="Уведомления">
            <NotificationsHeaderIcon />
          </button>
        </div>
        </div>
      </header>
    </>
  );
}
