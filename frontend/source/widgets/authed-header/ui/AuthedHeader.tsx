"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "@/source/features/session";
import type { SessionRole } from "@/source/features/session";
import { LogoIcon } from "@/source/shared/ui/icons";
import AuthedBurgerMenu from "./AuthedBurgerMenu";
import s from "./authedHeader.module.scss";

const NAV_PAGES = [
  { href: "/orders", label: "Заявки" },
  { href: "/news", label: "Новости" },
  { href: "/blog", label: "Блог" },
  { href: "/reviews", label: "Отзывы" },
] as const;

function cabinetHref(role: SessionRole | null): string {
  if (role === "EXPERT") return "/expert/orders";
  if (role === "CUSTOMER") return "/customer/orders";
  return "/settings";
}

const SHOW_THRESHOLD = 80;
const DELTA_THRESHOLD = 10;

const AuthedHeader = () => {
  const { role } = useSession();
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let frame: number | null = null;
    const onScroll = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastScrollY.current;
        if (y < SHOW_THRESHOLD) {
          setIsHidden(false);
        } else if (delta > DELTA_THRESHOLD) {
          setIsHidden(true);
        } else if (delta < -DELTA_THRESHOLD) {
          setIsHidden(false);
        }
        lastScrollY.current = y;
        frame = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  const cabinet = cabinetHref(role);
  const headerClass = `${s.header} ${isHidden ? s.headerHidden : ""}`.trim();

  return (
    <header className={headerClass}>
      <div className={s.container}>
        <Link href="/landing" className={s.brand} aria-label="На главную">
          <span className={s.logo}>
            <LogoIcon />
          </span>
        </Link>
        <nav className={s.nav}>
          {NAV_PAGES.map((page) => (
            <Link key={page.href} href={page.href} className={s.navLink}>
              {page.label}
            </Link>
          ))}
        </nav>
        <div className={s.actions}>
          <Link href={cabinet} className={s.cabinet}>
            Личный кабинет
          </Link>
        </div>
        <div className={s.mobileActions}>
          <Link href={cabinet} className={s.mobileCabinet}>
            Кабинет
          </Link>
          <AuthedBurgerMenu items={NAV_PAGES} />
        </div>
      </div>
    </header>
  );
};

export default AuthedHeader;
