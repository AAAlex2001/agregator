"use client";

import cn from "classnames";
import Link from "next/link";
import { countUnreadBySection, useChatList } from "@/entities/chat";
import { ordersPath, useUser } from "@/entities/user";
import {
  LogoIcon,
  TabChatIcon,
  TabOrdersIcon,
  TabProfileIcon,
  TabSupportIcon,
} from "@/shared/ui/icons";
import { getHeaderNavigation } from "../../config/navigation";
import { DesktopSections } from "../desktop-sections";
import { MobileMenu } from "../mobile-menu";
import styles from "./style.module.scss";

/** Публичные публикации в верхней строке кабинета. */
const PUBLICATION_LINKS = [
  {
    href: "/landing/news",
    label: "Новости",
  },
  {
    href: "/landing/blog",
    label: "Блог",
  },
  {
    href: "/posts",
    label: "Публикации",
  },
];

/** Собирает личные ссылки, разделы площадки и мобильное меню кабинета. */
export function CabinetHeader() {
  const { user, role } = useUser();
  const { chats } = useChatList();
  const badges = countUnreadBySection(chats);
  const ordersHref = ordersPath(role);
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const sections = role ? getHeaderNavigation(role) : [];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.top}>
          <Link
            href="/landing"
            className={styles.brand}
            aria-label="Ресурс-Плюс — на главную"
          >
            <LogoIcon />
          </Link>
          <nav
            className={styles.publications}
            aria-label="Публикации"
          >
            {PUBLICATION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.link}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <nav
            className={styles.actions}
            aria-label="Личные разделы"
          >
            <Link
              href={ordersHref}
              className={styles.link}
            >
              <TabOrdersIcon />
              <span>Все заказы</span>
            </Link>
            <Link
              href="/support"
              className={cn(styles.link, styles.support)}
            >
              <TabSupportIcon />
              <span>Поддержка</span>
            </Link>
            {role !== "LICENSE_HOLDER" && (
              <Link
                href="/chat"
                className={styles.link}
              >
                <TabChatIcon />
                <span>Сообщения</span>
              </Link>
            )}
            <Link
              href="/settings"
              className={cn(styles.link, styles.account)}
            >
              <TabProfileIcon />
              <span>{name || "Личный кабинет"}</span>
            </Link>
          </nav>
          <MobileMenu
            sections={sections}
            ordersHref={ordersHref}
          />
        </div>
        <nav
          className={styles.sections}
          aria-label="Разделы площадки"
        >
          <DesktopSections
            sections={sections}
            badges={badges}
          />
        </nav>
      </div>
    </header>
  );
}
