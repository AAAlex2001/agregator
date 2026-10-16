"use client";

import { usePathname } from "next/navigation";
import { ordersPath, useUser } from "@/entities/user";
import {
  BurgerHeaderIcon,
  DiplomaIcon,
  NewspaperIcon,
  TabChatIcon,
  TabOrdersIcon,
} from "@/shared/ui/icons";
import { getActiveMenuTab } from "../../config/menu-paths";
import { MenuTab } from "../menu-tab";
import styles from "./style.module.scss";

/** Открытие меню кабинета и каталога держателей. */
interface CabinetMenuTabsProps {
  onOpenMenu: () => void;
  onOpenLicenseHolders: () => void;
}

/** Собирает нижнюю навигацию кабинета с разделами, доступными текущей роли. */
export function CabinetMenuTabs({
  onOpenMenu,
  onOpenLicenseHolders,
}: CabinetMenuTabsProps) {
  const pathname = usePathname();
  const { role } = useUser();

  if (!role) {
    return null;
  }

  const ordersHref = ordersPath(role);
  const activeTab = getActiveMenuTab(pathname);
  const hasOrdersAndChats = role === "CUSTOMER" || role === "EXPERT";

  return (
    <>
      <div
        className={styles.spacer}
        aria-hidden="true"
      />
      <nav
        className={styles.menuTabs}
        aria-label="Навигация кабинета"
      >
        <MenuTab
          label="Меню"
          icon={<BurgerHeaderIcon />}
          onClick={onOpenMenu}
        />
        {hasOrdersAndChats && (
          <MenuTab
            label="Заказы"
            icon={<TabOrdersIcon />}
            href={ordersHref}
            isActive={activeTab === "orders"}
          />
        )}
        <MenuTab
          label="Публикации"
          icon={<NewspaperIcon />}
          href="/posts"
          isActive={activeTab === "posts"}
        />
        {hasOrdersAndChats && (
          <MenuTab
            label="Чаты"
            icon={<TabChatIcon />}
            href="/chat"
            isActive={activeTab === "chat"}
          />
        )}
        {role === "EXPERT" && (
          <MenuTab
            label="Держатели"
            icon={<DiplomaIcon size={22} />}
            onClick={onOpenLicenseHolders}
          />
        )}
      </nav>
    </>
  );
}
