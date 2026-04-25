"use client";

import { useEffect, useState } from "react";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useSession } from "@/source/features/session";
import { PersonalDataForm } from "@/source/features/profile/settings";
import { NotificationPreferencesForm } from "@/source/features/profile/notifications";
import { SubscriptionPanel } from "@/source/widgets/subscription-panel";
import { SettingsSkeleton } from "./SettingsSkeleton";
import s from "./SettingsWidget.module.scss";

type SettingsSection = "personal" | "notifications" | "subscription";

interface SettingsWidgetProps {
  explicitSection: SettingsSection | null;
}

function buildTabs(isExpert: boolean): Array<{ id: SettingsSection; label: string }> {
  const base: Array<{ id: SettingsSection; label: string }> = [];
  if (isExpert) {
    base.push({ id: "subscription", label: "Подписка" });
  }
  base.push({ id: "personal", label: "Личные данные" });
  base.push({ id: "notifications", label: "Уведомления" });
  return base;
}

function defaultSection(isExpert: boolean): SettingsSection {
  return isExpert ? "subscription" : "personal";
}

export function SettingsWidget({ explicitSection }: SettingsWidgetProps) {
  const { user, role, isLoading, error, setUser } = useSession();
  const isExpert = role === "EXPERT";
  const initial = explicitSection ?? defaultSection(isExpert);
  const [section, setSection] = useState<SettingsSection>(initial);

  useEffect(() => {
    setSection(explicitSection ?? defaultSection(isExpert));
  }, [explicitSection, isExpert]);

  const tabs = buildTabs(isExpert);

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Настройки профиля" as="h1" className={s.pageTitle} />
        <Subtitle text="Управляйте личными данными" className={s.pageSubtitle} />
      </div>
      <div className={`${s.content} ${section === "subscription" ? s.contentWide : ""}`}>
        <Tabs
          variant="pill"
          tabs={tabs}
          activeTab={section}
          onTabChange={(id) => setSection(id as SettingsSection)}
          className={s.tabs}
        />

        {error && <p className={s.error}>{error}</p>}

        {section === "subscription" ? (
          <SubscriptionPanel />
        ) : isLoading || !user ? (
          <SettingsSkeleton section={section} isCustomer />
        ) : (
          <SettingsContent
            section={section}
            user={user}
            onProfileUpdate={setUser}
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
}

function SettingsContent({ section, user, onProfileUpdate }: SettingsContentProps) {
  if (section === "notifications") {
    return <NotificationPreferencesForm profile={user} onProfileUpdate={onProfileUpdate} />;
  }
  if (section === "subscription" && user.role === "EXPERT") {
    return <SubscriptionPanel />;
  }
  return <PersonalDataForm profile={user} onProfileUpdate={onProfileUpdate} />;
}
