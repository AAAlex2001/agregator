"use client";

import cn from "classnames";
import Link from "next/link";
import { ordersPath, useSession } from "@/source/entities/session";
import { ExpertHelpPlates } from "@/source/widgets/expert-help";
import { LogoIcon, TabOrdersIcon, TabChatIcon, TabProfileIcon, TabSupportIcon } from "@/source/shared/ui/icons";
import CabinetBurgerMenu from "./CabinetBurgerMenu";
import s from "./header-authed.module.scss";

const PUBLICATION_LINKS = [
  { href: "/landing/news", label: "Новости" },
  { href: "/landing/blog", label: "Блог" },
  { href: "/posts", label: "Публикации" },
] as const;

/** Показывает логотип и личные ссылки сверху, разделы площадки — второй строкой. */
export default function HeaderAuthed() {
  const { user, role } = useSession();
  const ordersHref = ordersPath(role);
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ");

  return (
    <header className={s.header}>
      <div className={s.container}>
        <div className={s.top}>
          <Link href="/landing" className={s.brand} aria-label="Ресурс-Плюс — на главную">
            <LogoIcon />
          </Link>
          <nav className={s.publications} aria-label="Публикации">
            {PUBLICATION_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={s.link}>
                {link.label}
              </Link>
            ))}
          </nav>
          <nav className={s.actions} aria-label="Личные разделы">
            <Link href={ordersHref} className={s.link}>
              <TabOrdersIcon />
              <span>Все заказы</span>
            </Link>
            <Link href="/support" className={cn(s.link, s.support)}>
              <TabSupportIcon />
              <span>Поддержка</span>
            </Link>
            {role !== "LICENSE_HOLDER" && (
              <Link href="/chat" className={s.link}>
                <TabChatIcon />
                <span>Сообщения</span>
              </Link>
            )}
            <Link href="/settings" className={cn(s.link, s.account)}>
              <TabProfileIcon />
              <span>{name || "Личный кабинет"}</span>
            </Link>
          </nav>
          <CabinetBurgerMenu />
        </div>
        <nav className={s.sections} aria-label="Разделы площадки">
          <ExpertHelpPlates compact spread />
        </nav>
      </div>
    </header>
  );
}
