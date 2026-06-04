"use client";

import { useEffect, useState } from "react";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { RoleBadge } from "@/source/shared/ui";
import { useSession } from "@/source/features/session";
import { CustomerSettingsForm } from "@/source/features/profile/customer-settings";
import { ExpertSettingsForm } from "@/source/features/profile/expert-settings";
import {
  LicenseHolderProfileForm,
  LicenseTermsForm,
} from "@/source/features/profile/license-holder-settings";
import { NotificationPreferencesForm } from "@/source/features/profile/notifications";
import { SubscriptionPanel } from "@/source/widgets/subscription-panel";
import type { UserProfile } from "@/source/entities/user";
import { SettingsSkeleton } from "./SettingsSkeleton";
import s from "./SettingsWidget.module.scss";

type SettingsSection = "personal" | "notifications" | "subscription" | "license";

interface SettingsWidgetProps {
  explicitSection: SettingsSection | null;
}

function buildTabs(role: string | null): Array<{ id: SettingsSection; label: string }> {
  if (role === "EXPERT") {
    return [
      { id: "notifications", label: "Уведомления" },
      { id: "subscription", label: "Подписка" },
      { id: "personal", label: "Личные данные" },
    ];
  }
  if (role === "LICENSE_HOLDER") {
    return [
      { id: "license", label: "Лицензия" },
      { id: "personal", label: "Личные данные" },
    ];
  }
  return [
    { id: "notifications", label: "Уведомления" },
    { id: "personal", label: "Личные данные" },
  ];
}

function defaultSection(role: string | null): SettingsSection {
  if (role === "LICENSE_HOLDER") return "license";
  if (role === "EXPERT" || role === "CUSTOMER") return "notifications";
  return "personal";
}

export function SettingsWidget({ explicitSection }: SettingsWidgetProps) {
  const { user, role, isLoading, error, setUser } = useSession();
  const initial = explicitSection ?? defaultSection(role);
  const [section, setSection] = useState<SettingsSection>(initial);

  useEffect(() => {
    setSection(explicitSection ?? defaultSection(role));
  }, [explicitSection, role]);

  const tabs = buildTabs(role);

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Настройки профиля" as="h1" className={s.pageTitle} />
        <Subtitle text="Управляйте личными данными" className={s.pageSubtitle} />
      </div>
      {role && (
        <div className={s.roleBadgeRow}>
          <RoleBadge role={role} />
        </div>
      )}
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
          <SettingsContent section={section} user={user} onProfileUpdate={setUser} />
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
  if (section === "license" && user.role === "LICENSE_HOLDER") {
    return <LicenseTermsForm profile={user} onProfileUpdate={onProfileUpdate} />;
  }
  if (section === "subscription" && user.role === "EXPERT") {
    return <SubscriptionPanel />;
  }
  return <PersonalProfileForm profile={user} onProfileUpdate={onProfileUpdate} />;
}

function PersonalProfileForm({
  profile,
  onProfileUpdate,
}: {
  profile: UserProfile;
  onProfileUpdate: (p: UserProfile | null) => void;
}) {
  if (profile.role === "EXPERT") {
    return <ExpertSettingsForm profile={profile} onProfileUpdate={onProfileUpdate} />;
  }
  if (profile.role === "LICENSE_HOLDER") {
    return <LicenseHolderProfileForm profile={profile} onProfileUpdate={onProfileUpdate} />;
  }
  return <CustomerSettingsForm profile={profile} onProfileUpdate={onProfileUpdate} />;
}
