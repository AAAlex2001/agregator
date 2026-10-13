"use client";

import cn from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import type { UserProfile } from "@/source/entities/user";
import { useSession } from "@/source/entities/session";
import { ReferralPanel, ReferralPanelSkeleton } from "@/source/features/settings/referrals";
import { SubscriptionPanel } from "@/source/features/settings/subscription";
import { RoleBadge } from "@/source/shared/ui";
import Tabs from "@/source/shared/ui/Tabs";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { getSettingsTabs, resolveSettingsSection, type SettingsSection } from "../lib/sections";
import { Notifications } from "./Notifications";
import { PersonalData } from "./PersonalData";
import { SettingsSkeleton } from "./SettingsSkeleton";
import s from "./SettingsWidget.module.scss";

interface SettingsContentProps {
  section: SettingsSection;
  user: UserProfile | null;
  isLoading: boolean;
  isCustomer: boolean;
}

/** Страница настроек: заголовок, вкладки под роль и содержимое выбранной вкладки; вкладка хранится в URL. */
export function SettingsWidget() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, role, isLoading, error } = useSession();
  const tabs = getSettingsTabs(role);
  const section = resolveSettingsSection(searchParams.get("section"), role);

  const selectSection = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", value);
    router.push(`/settings?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <div className={s.heading}>
          <Title text="Настройки" as="h1" />
          <Subtitle text="Профиль, уведомления и возможности аккаунта" className={s.pageSubtitle} />
        </div>
        {role && <RoleBadge role={role} />}
      </div>

      <div className={cn(s.content, { [s.contentWide]: section === "subscription" || section === "referrals" })}>
        <Tabs variant="underline" tabs={tabs} activeTab={section} onTabChange={selectSection} className={s.tabs} />

        {error && <p className={s.error} role="alert">{error}</p>}

        <SettingsContent section={section} user={user} isLoading={isLoading} isCustomer={role === "CUSTOMER"} />
      </div>
    </div>
  );
}

/** Содержимое выбранной вкладки: заглушка, пока грузится профиль. */
function SettingsContent({ section, user, isLoading, isCustomer }: SettingsContentProps) {
  if (section === "subscription") return <SubscriptionPanel />;

  if (section === "referrals") {
    if (isLoading) return <ReferralPanelSkeleton />;
    if (user?.email_verified) return <ReferralPanel />;

    return <p className={s.notice}>Подтвердите почту, чтобы приглашать коллег и получать плюсы.</p>;
  }

  if (isLoading || !user) return <SettingsSkeleton section={section} isCustomer={isCustomer} />;

  if (section === "notifications") return <Notifications user={user} />;

  return <PersonalData user={user} />;
}
