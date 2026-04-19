"use client";

import { useEffect, useState } from "react";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useSession } from "@/source/features/session";
import { PersonalDataForm } from "@/source/features/profile/settings";
import { FinancePanel } from "@/source/features/finance";
import { SettingsSkeleton } from "./SettingsSkeleton";
import s from "./SettingsWidget.module.scss";

interface SettingsWidgetProps {
  initialSection: "personal" | "finance";
}

export function SettingsWidget({ initialSection }: SettingsWidgetProps) {
  const { user, resolvedRole, isLoading, error, setUser, mergeUser } = useSession();
  const [section, setSection] = useState<"personal" | "finance">(initialSection);

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection]);

  const isExpert = resolvedRole === "EXPERT";

  const tabs = isExpert
    ? [{ id: "personal", label: "Личные данные" }, { id: "finance", label: "Финансы" }]
    : [{ id: "personal", label: "Личные данные" }];

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Настройки профиля" as="h1" className={s.pageTitle} />
        <Subtitle
          text="Управляйте личными данными"
          className={s.pageSubtitle}
        />
      </div>
      <div className={s.content}>
        <Tabs
          variant="pill"
          tabs={tabs}
          activeTab={section}
          onTabChange={(id) => setSection(id as "personal" | "finance")}
          className={s.tabs}
        />

        {error && <p className={s.error}>{error}</p>}

        {isLoading || !user ? (
          <SettingsSkeleton section={section} />
        ) : section === "personal" || !isExpert ? (
          <PersonalDataForm profile={user} onProfileUpdate={setUser} />
        ) : (
          <FinancePanel
            balance={user.balance ?? 0}
            onBalanceChange={(b) => mergeUser({ balance: b })}
            returnUrl={typeof window !== "undefined"
              ? `${window.location.origin}/settings?section=finance`
              : ""}
          />
        )}
      </div>
    </div>
  );
}
