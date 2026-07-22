"use client";

import { useState } from "react";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import {
  ContactFields,
  NameFields,
  PasswordFields,
  ProfileAvatarUpload,
  SaveBar,
  useProfileShell,
  type UserProfile,
} from "@/source/entities/user";
import { ChangeEmailModal } from "@/source/features/profile/change-email";
import { ExpertLocationSection } from "./ExpertLocationSection";
import { ExpertCertificatesSection } from "./ExpertCertificatesSection";
import { ExpertContactOfferSection } from "./ExpertContactOfferSection";
import s from "@/source/entities/user/ui/ProfileForm.module.scss";

interface Props {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile | null) => void;
}

export function ExpertSettingsForm({ profile, onProfileUpdate }: Props) {
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
          <h2 className={s.subtitle}>Персональные данные</h2>
          <div className={s.grid}>
            <NameFields
              firstName={form.firstName}
              lastName={form.lastName}
              onChangeFirstName={form.setFirstName}
              onChangeLastName={form.setLastName}
            />
            <ContactFields
              phone={form.phone}
              email={form.email}
              emailVerified={profile.email_verified}
              onChangePhone={form.setPhone}
              onChangeEmail={form.setEmail}
              onRequestEmailChange={() => setEmailModalOpen(true)}
            />
          </div>
        </section>

        <ExpertContactOfferSection />

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

        <ExpertLocationSection profile={profile} onProfileUpdate={onProfileUpdate} />

        <ExpertCertificatesSection profile={profile} onProfileUpdate={onProfileUpdate} />

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
