"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { RoleBadge } from "@/source/shared/ui";
import { useSession } from "@/source/features/session";
import { CustomerSettingsForm } from "@/source/features/profile/customer-settings";
import { ExpertSettingsForm } from "@/source/features/profile/expert-settings";
import { LicenseHolderProfileForm } from "@/source/features/profile/license-holder-settings";
import { NotificationPreferencesForm } from "@/source/features/profile/notifications";
import { ReferralPanel, ReferralPanelSkeleton } from "@/source/features/referrals/invite-colleague";
import { SubscriptionPanel } from "@/source/widgets/subscription-panel";
import type { UserProfile } from "@/source/entities/user";
import { getSettingsTabs, resolveSettingsSection, type SettingsSection } from "../model/sections";
import { SettingsSkeleton } from "./SettingsSkeleton";
import s from "./SettingsWidget.module.scss";

interface SettingsContentProps {
  section: SettingsSection;
  user: UserProfile | null;
  isLoading: boolean;
  isCustomer: boolean;
  onProfileUpdate: (profile: UserProfile | null) => void;
}

/** Показывает настройки роли во вкладках и сохраняет выбранную вкладку в URL. */
export function SettingsWidget() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, role, isLoading, error, setUser } = useSession();
  const tabs = getSettingsTabs(role);
  const section = resolveSettingsSection(searchParams.get("section"), role);

  function selectSection(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", value);
    router.push(`/settings?${params.toString()}`, { scroll: false });
  }

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <div className={s.heading}>
          <Title text="Настройки" as="h1" />
          <Subtitle text="Профиль, уведомления и возможности аккаунта" className={s.pageSubtitle} />
        </div>
        {role && <RoleBadge role={role} />}
      </div>

      <div className={`${s.content} ${(section === "subscription" || section === "referrals") ? s.contentWide : ""}`.trim()}>
        <Tabs
          variant="underline"
          tabs={tabs}
          activeTab={section}
          onTabChange={selectSection}
          className={s.tabs}
        />

        {error && <p className={s.error} role="alert">{error}</p>}

        <SettingsContent
          section={section}
          user={user}
          isLoading={isLoading}
          isCustomer={role === "CUSTOMER"}
          onProfileUpdate={setUser}
        />
      </div>
    </div>
  );
}

function SettingsContent({ section, user, isLoading, isCustomer, onProfileUpdate }: SettingsContentProps) {
  if (section === "subscription") {
    return <SubscriptionPanel />;
  }
  if (section === "referrals") {
    if (isLoading) return <ReferralPanelSkeleton />;
    if (user?.email_verified) return <ReferralPanel />;

    return <p className={s.notice}>Подтвердите почту, чтобы приглашать коллег и получать плюсы.</p>;
  }
  if (isLoading || !user) {
    return <SettingsSkeleton section={section} isCustomer={isCustomer} />;
  }
  if (section === "notifications") {
    return <NotificationPreferencesForm profile={user} onProfileUpdate={onProfileUpdate} />;
  }
  if (user.role === "EXPERT") {
    return <ExpertSettingsForm profile={user} onProfileUpdate={onProfileUpdate} />;
  }
  if (user.role === "LICENSE_HOLDER") {
    return <LicenseHolderProfileForm profile={user} onProfileUpdate={onProfileUpdate} />;
  }
  return <CustomerSettingsForm profile={user} onProfileUpdate={onProfileUpdate} />;
}
