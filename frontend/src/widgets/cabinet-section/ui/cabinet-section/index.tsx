"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ordersPath, useUser } from "@/entities/user";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { getPageHeading } from "../../config/page-headings";
import { getSectionTabs } from "../../config/section-tabs";
import styles from "./style.module.scss";

/** Содержимое страницы раздела кабинета. */
interface CabinetSectionProps {
  children: ReactNode;
}

/** Собирает заголовок и вкладки раздела над содержимым страницы. */
export function CabinetSection({ children }: CabinetSectionProps) {
  const pathname = usePathname();
  const { role } = useUser();
  const tabs = getSectionTabs(pathname, role, ordersPath(role));
  const heading = getPageHeading(pathname);

  if (tabs.length === 0) {
    return children;
  }

  return (
    <div className={styles.section}>
      <div className={styles.navigation}>
        {heading && (
          <header className={styles.pageHead}>
            <Title
              as="h1"
              text={heading.title}
            />
            <Subtitle
              text={heading.subtitle}
              className={styles.subtitle}
            />
          </header>
        )}
        <nav
          className={styles.tabs}
          aria-label="Вкладки раздела"
        >
          {tabs.map((tab) => {
            const isChatThread =
              tab.href === "/chat" &&
              pathname.startsWith("/chat/");
            const isActive = pathname === tab.href || isChatThread;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(styles.tab, {
                  [styles.active]: isActive,
                })}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {children}
    </div>
  );
}
