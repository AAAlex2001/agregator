"use client";

import cn from "classnames";
import type { ReactNode } from "react";
import { RoleBadge, useUser } from "@/entities/user";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { getSettingsTabs } from "../../model/sections";
import type { SettingsSection } from "../../model/sections";
import { SettingsTabs } from "../settings-tabs";
import styles from "./style.module.scss";

/** Открытая вкладка и её содержимое. */
interface SettingsLayoutProps {
  section: SettingsSection;
  children: ReactNode;
}

/** Страница настроек: заголовок с ролью, вкладки под роль и содержимое вкладки. */
export function SettingsLayout({ section, children }: SettingsLayoutProps) {
  const { role, error } = useUser();
  const isWide = section === "subscription" || section === "referrals";

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageHead}>
        <div className={styles.heading}>
          <Title
            text="Настройки"
            as="h1"
          />
          <Subtitle
            text="Профиль, уведомления и возможности аккаунта"
            className={styles.pageSubtitle}
          />
        </div>
        <RoleBadge role={role} />
      </div>

      <div
        className={cn(styles.content, {
          [styles.contentWide]: isWide,
        })}
      >
        <SettingsTabs
          tabs={getSettingsTabs(role)}
          activeSection={section}
        />

        {error && (
          <p
            className={styles.error}
            role="alert"
          >
            {error}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
