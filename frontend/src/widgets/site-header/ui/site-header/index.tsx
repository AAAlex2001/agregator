"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { LogoIcon } from "@/shared/ui/icons";
import { HEADER_LINKS } from "../../config/navigation";
import type { SiteHeaderProps } from "../../model/types";
import { DirectionsMarquee } from "../directions-marquee";
import { GuestCapabilities } from "../guest-capabilities";
import { MobileMenu } from "../mobile-menu";
import styles from "./style.module.scss";

/** Собирает публичную шапку; открытие авторизации передаётся из оболочки приложения. */
export function SiteHeader({
  onOpenLogin,
  onOpenRegister,
  breadcrumbs,
}: SiteHeaderProps) {
  return (
    <>
      <div className={styles.shell}>
        <DirectionsMarquee />
        <header className={styles.header}>
          <div className={styles.container}>
            <Link
              href="/"
              className={styles.brand}
              aria-label="На главную"
            >
              <span className={styles.logo}>
                <LogoIcon title="Ресурс-Плюс" />
              </span>
            </Link>

            <nav className={styles.nav}>
              {HEADER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className={styles.actions}>
              <Button
                variant="outline"
                className={styles.login}
                onClick={onOpenLogin}
              >
                Войти
              </Button>
              <Button
                variant="primary"
                className={styles.signUp}
                onClick={onOpenRegister}
              >
                Зарегистрироваться
              </Button>
            </div>

            <div className={styles.mobileActions}>
              <Button
                variant="outline"
                size="sm"
                className={styles.mobileLogin}
                onClick={onOpenLogin}
              >
                Войти
              </Button>
              <MobileMenu
                onOpenLogin={onOpenLogin}
                onOpenRegister={onOpenRegister}
              />
            </div>
          </div>

          <nav
            className={styles.guestNav}
            aria-label="Возможности после регистрации"
          >
            <GuestCapabilities />
          </nav>
        </header>
      </div>
      {breadcrumbs}
    </>
  );
}

