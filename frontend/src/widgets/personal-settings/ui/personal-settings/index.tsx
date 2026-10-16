"use client";

import type { ReactNode } from "react";
import { CompanyReadonly } from "@/entities/company";
import { useUser } from "@/entities/user";
import { ChangeAvatar } from "@/features/change-avatar";
import { ChangeEmailField } from "@/features/change-email";
import { ChangePasswordForm } from "@/features/change-password";
import { ContactOfferForm } from "@/features/edit-contact-offer";
import { ExpertLocationForm } from "@/features/edit-expert-location";
import { EditUserProfileForm } from "@/features/edit-user-profile";
import { FormSection } from "@/shared/ui/form-section";
import { PersonalSettingsSkeleton } from "../personal-settings-skeleton";
import styles from "./style.module.scss";

/** Секция анкет направлений, которую собирает страница настроек. */
interface PersonalSettingsProps {
  directions: ReactNode;
}

/** Вкладка «Личные данные»: фото, контакты, компания, пароль и анкеты под роль. */
export function PersonalSettings({ directions }: PersonalSettingsProps) {
  const { user, role, isLoading } = useUser();

  if (isLoading || !user) {
    return <PersonalSettingsSkeleton isCustomer={role === "CUSTOMER"} />;
  }

  const isExpert = user.role === "EXPERT";

  return (
    <div
      key={user.id}
      className={styles.personal}
    >
      <ChangeAvatar avatarUrl={user.avatar_url} />

      <EditUserProfileForm
        profile={user}
        withName={user.role !== "LICENSE_HOLDER"}
        emailField={<ChangeEmailField profile={user} />}
      />

      {user.inn && user.company_data && (
        <FormSection title="Компания">
          <CompanyReadonly
            companyName={user.company_data.value ?? ""}
            inn={user.inn}
          />
        </FormSection>
      )}

      <ChangePasswordForm />

      {isExpert && <ExpertLocationForm profile={user} />}

      {directions}

      {isExpert && <ContactOfferForm />}
    </div>
  );
}
