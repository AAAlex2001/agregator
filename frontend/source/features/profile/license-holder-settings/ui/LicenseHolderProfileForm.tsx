"use client";

import { useState } from "react";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import {
  CompanyReadonly,
  ContactFields,
  PasswordFields,
  ProfileAvatarUpload,
  SaveBar,
  useProfileShell,
  type UserProfile,
} from "@/source/entities/user";
import { ChangeEmailModal } from "@/source/features/profile/change-email";
import s from "@/source/entities/user/ui/ProfileForm.module.scss";

interface Props {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile | null) => void;
}

export function LicenseHolderProfileForm({ profile, onProfileUpdate }: Props) {
  const { form, avatarPreviewUrl, avatarError, isLoggingOut, isSaving, handleAvatarSelect, submit } =
    useProfileShell({ profile, onProfileUpdate });
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  return (
    <>
      <ProfileAvatarUpload
        avatarUrl={profile.avatar_url}
        previewUrl={avatarPreviewUrl}
        disabled={isSaving || isLoggingOut}
        error={avatarError}
        onSelect={handleAvatarSelect}
      />
      <form className={s.form} onSubmit={submit} autoComplete="off">
        <AutofillGuard idPrefix="profile" />

        <section className={s.section}>
          <h2 className={s.subtitle}>Контактные данные</h2>
          <div className={s.grid}>
            <ContactFields
              phone={form.phone}
              email={form.email}
              emailVerified={profile.email_verified}
              onChangePhone={form.setPhone}
              onChangeEmail={form.setEmail}
              onRequestEmailChange={() => setEmailModalOpen(true)}
            />
          </div>
          {profile.inn && profile.company_data && (
            <CompanyReadonly companyName={profile.company_data.value ?? ""} inn={profile.inn} />
          )}
        </section>

        <section className={s.section}>
          <h2 className={s.subtitle}>Изменить пароль</h2>
          <div className={s.grid}>
            <PasswordFields
              password={form.password}
              repeatPassword={form.repeatPassword}
              onChangePassword={form.setPassword}
              onChangeRepeatPassword={form.setRepeatPassword}
            />
          </div>
        </section>

        <SaveBar isSaving={isSaving} />
      </form>

      <ChangeEmailModal
        open={emailModalOpen}
        currentEmail={profile.email}
        onClose={() => setEmailModalOpen(false)}
        onChanged={(next) => {
          onProfileUpdate(next);
          setEmailModalOpen(false);
        }}
      />
    </>
  );
}
