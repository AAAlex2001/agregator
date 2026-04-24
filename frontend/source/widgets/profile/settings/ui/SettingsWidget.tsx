"use client";

import { useEffect, useState } from "react";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useSession } from "@/source/features/session";
import { PersonalDataForm } from "@/source/features/profile/settings";
import { NotificationPreferencesForm } from "@/source/features/profile/notifications";
import { FinancePanel } from "@/source/features/finance";
import { SettingsSkeleton } from "./SettingsSkeleton";
import s from "./SettingsWidget.module.scss";

type SettingsSection = "personal" | "notifications" | "finance";

interface SettingsWidgetProps {
  initialSection: SettingsSection;
}

function buildTabs(isExpert: boolean): Array<{ id: SettingsSection; label: string }> {
  const base: Array<{ id: SettingsSection; label: string }> = [
    { id: "personal", label: "Личные данные" },
    { id: "notifications", label: "Уведомления" },
  ];
  if (isExpert) {
    base.push({ id: "finance", label: "Финансы" });
  }
  return base;
}

export function SettingsWidget({ initialSection }: SettingsWidgetProps) {
  const { user, role, isLoading, error, setUser, mergeUser } = useSession();
  const [section, setSection] = useState<SettingsSection>(initialSection);

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection]);

  const isExpert = role === "EXPERT";
  const tabs = buildTabs(isExpert);

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Настройки профиля" as="h1" className={s.pageTitle} />
        <Subtitle text="Управляйте личными данными" className={s.pageSubtitle} />
      </div>
      <div className={s.content}>
        <Tabs
          variant="pill"
          tabs={tabs}
          activeTab={section}
          onTabChange={(id) => setSection(id as SettingsSection)}
          className={s.tabs}
        />

        {error && <p className={s.error}>{error}</p>}

        {isLoading || !user ? (
          <SettingsSkeleton section={section} isCustomer />
        ) : (
          <SettingsContent
            section={section}
            user={user}
            onProfileUpdate={setUser}
            onBalanceChange={(balance) => mergeUser({ balance })}
          />
        )}
      </div>
    </div>
  );
}

interface SettingsContentProps {
  section: SettingsSection;
  user: NonNullable<ReturnType<typeof useSession>["user"]>;
  onProfileUpdate: ReturnType<typeof useSession>["setUser"];
  onBalanceChange: (balance: number) => void;
}

function SettingsContent({ section, user, onProfileUpdate, onBalanceChange }: SettingsContentProps) {
  if (section === "notifications") {
    return <NotificationPreferencesForm profile={user} onProfileUpdate={onProfileUpdate} />;
  }
  if (section === "finance" && user.role === "EXPERT") {
    return (
      <FinancePanel
        balance={user.balance ?? 0}
        onBalanceChange={onBalanceChange}
        returnUrl={typeof window !== "undefined"
          ? `${window.location.origin}/settings?section=finance`
          : ""}
      />
    );
  }
  return <PersonalDataForm profile={user} onProfileUpdate={onProfileUpdate} />;
}
