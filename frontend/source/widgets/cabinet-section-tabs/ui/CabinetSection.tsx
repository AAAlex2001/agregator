"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useSession } from "@/source/entities/session";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { ORDER_PAGE_HEADINGS } from "../model/headings";
import { getSectionTabs } from "../model/sections";
import tabStyles from "@/source/shared/ui/Tabs/Tabs.module.scss";
import s from "./CabinetSection.module.scss";

/** Размещает заголовок над вкладками и оставляет активную вкладку в видимой области. */
export function CabinetSection({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { role } = useSession();
  const navRef = useRef<HTMLElement>(null);
  const tabs = getSectionTabs(pathname, role);
  const heading = ORDER_PAGE_HEADINGS[pathname];

  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (nav && active) nav.scrollLeft = active.offsetLeft;
  }, [pathname, role]);

  if (!tabs.length) return children;

  return (
    <div className={s.section}>
      <div className={s.navigation}>
        {heading && (
          <header className={s.pageHead}>
            <Title as="h1" text={heading.title} />
            <Subtitle text={heading.subtitle} className={s.subtitle} />
          </header>
        )}
        <nav ref={navRef} className={cn(tabStyles.underlineBar, s.tabs)} aria-label="Вкладки раздела">
          {tabs.map((tab) => {
            const active = pathname === tab.href
              || (tab.href === "/chat" && pathname.startsWith("/chat/"));

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(tabStyles.underline, s.tab, {
                  [tabStyles.underlineActive]: active,
                })}
                aria-current={active ? "page" : undefined}
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
