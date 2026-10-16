"use client";

import { useUser } from "@/entities/user";
import { NotificationSettings } from "@/widgets/notification-settings";
import { PersonalSettings } from "@/widgets/personal-settings";
import { ReferralSettings } from "@/widgets/referral-settings";
import {
  resolveSettingsSection,
  SettingsLayout,
} from "@/widgets/settings-layout";
import { SubscriptionSettings } from "@/widgets/subscription-settings";
import { DirectionSettings } from "./ui/direction-settings";

/** Вкладка настроек из адреса страницы. */
interface SettingsPageContentProps {
  section: string | null;
}

/** Собирает вкладку настроек, доступную роли текущего аккаунта. */
export function SettingsPageContent({ section }: SettingsPageContentProps) {
  const { user, role } = useUser();
  const activeSection = resolveSettingsSection(section, role);

  return (
    <SettingsLayout section={activeSection}>
      {activeSection === "personal" && (
        <PersonalSettings directions={user && <DirectionSettings profile={user} />} />
      )}
      {activeSection === "notifications" && <NotificationSettings />}
      {activeSection === "subscription" && <SubscriptionSettings />}
      {activeSection === "referrals" && <ReferralSettings />}
    </SettingsLayout>
  );
}
