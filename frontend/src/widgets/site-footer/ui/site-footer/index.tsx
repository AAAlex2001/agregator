"use client";

import cn from "classnames";
import Link from "next/link";
import { LogoIcon } from "@/shared/ui/icons";
import {
  DIRECTION_LINKS,
  DOCUMENT_LINKS,
  PLATFORM_LINKS,
  SERVICE_LINKS,
} from "../../config/navigation";
import type { SiteFooterProps } from "../../model/types";
import { BackgroundImages } from "../background-images";
import { LegalNotice } from "../legal-notice";
import { LinkGroup } from "../link-group";
import styles from "./style.module.scss";

/** Собирает подвал; открытие регистрации связывается с авторизацией в приложении. */
export function SiteFooter({ variant = "dark", onOpenRegister }: SiteFooterProps) {
  const isLight = variant === "light";

  return (
    <footer
      className={cn(styles.footer, {
        [styles.light]: isLight,
      })}
      id="footer"
    >
      <div className={styles.content}>
        <div className={styles.primary}>
          {!isLight && <BackgroundImages />}
          <div className={styles.primaryLogo}>
            <Link
              href="/"
              aria-label="На главную"
            >
              <LogoIcon title="Ресурс-Плюс" />
            </Link>
            <p>Первая единая площадка промышленных и инженерных услуг России</p>
          </div>

          <div className={styles.links}>
            <LinkGroup
              title="Направления"
              links={DIRECTION_LINKS}
            />
            <LinkGroup
              title="Платформа"
              links={PLATFORM_LINKS}
            />
            <LinkGroup
              title="Сервисы"
              links={SERVICE_LINKS}
            />
            <div>
              <h2>Начать работу</h2>
              <button
                type="button"
                onClick={onOpenRegister}
              >
                Разместить заказ
              </button>
              <button
                type="button"
                onClick={onOpenRegister}
              >
                Создать профиль исполнителя
              </button>
              <button
                type="button"
                onClick={onOpenRegister}
              >
                Разместить разрешительные документы
              </button>
            </div>
            <LinkGroup
              title="Документы"
              links={DOCUMENT_LINKS}
            />
          </div>
        </div>
        <LegalNotice isLight={isLight} />
      </div>
    </footer>
  );
}
