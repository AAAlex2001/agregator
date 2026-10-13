"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useSession } from "@/source/entities/session";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { ORDER_PAGE_HEADINGS } from "../model/headings";
import { getSectionTabs } from "../model/sections";
import s from "./CabinetSection.module.scss";

interface CabinetSectionProps {
  children: ReactNode;
}

/** Заголовок раздела кабинета и вкладки его страниц над содержимым. */
export function CabinetSection({ children }: CabinetSectionProps) {
  const pathname = usePathname();
  const { role } = useSession();
  const tabs = getSectionTabs(pathname, role);
  const heading = ORDER_PAGE_HEADINGS[pathname];

  if (tabs.length === 0) return children;

  return (
    <div className={s.section}>
      <div className={s.navigation}>
        {heading && (
          <header className={s.pageHead}>
            <Title as="h1" text={heading.title} />
            <Subtitle text={heading.subtitle} className={s.subtitle} />
          </header>
        )}
        <nav className={s.tabs} aria-label="Вкладки раздела">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || (tab.href === "/chat" && pathname.startsWith("/chat/"));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(s.tab, { [s.active]: isActive })}
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
