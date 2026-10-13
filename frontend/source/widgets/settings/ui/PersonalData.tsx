"use client";

import { CompanyReadonly, type UserProfile } from "@/source/entities/user";
import { EmailField } from "@/source/features/settings/personal-data/change-email";
import { PasswordForm } from "@/source/features/settings/personal-data/change-password";
import { ContactOfferForm } from "@/source/features/settings/personal-data/contact-offer";
import { DirectionsSection } from "@/source/features/settings/personal-data/directions";
import { ExpertLocationForm } from "@/source/features/settings/personal-data/expert-location";
import { LicenseTermsForm } from "@/source/features/settings/personal-data/license-terms";
import { InfoForm } from "@/source/features/settings/personal-data/update-info";
import { PhotoPicker } from "@/source/features/settings/personal-data/update-photo";
import { FormSection } from "@/source/shared/ui";
import s from "./PersonalData.module.scss";

interface PersonalDataProps {
  user: UserProfile;
}

/** Вкладка «Личные данные»: фото, контакты, компания, пароль и анкеты направлений — набор блоков зависит от роли. */
export function PersonalData({ user }: PersonalDataProps) {
  const isExpert = user.role === "EXPERT";
  const isLicenseHolder = user.role === "LICENSE_HOLDER";

  return (
    <div className={s.personal}>
      <PhotoPicker avatarUrl={user.avatar_url} />

      <InfoForm profile={user} withName={!isLicenseHolder} emailField={<EmailField profile={user} />} />

      {user.inn && user.company_data && (
        <FormSection title="Компания">
          <CompanyReadonly companyName={user.company_data.value ?? ""} inn={user.inn} />
        </FormSection>
      )}

      <PasswordForm />

      {isExpert && <ExpertLocationForm profile={user} />}

      <DirectionsSection role={user.role} licenseTerms={isLicenseHolder && <LicenseTermsForm profile={user} />} />

      {isExpert && <ContactOfferForm />}
    </div>
  );
}
