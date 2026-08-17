"use client";

import { useState } from "react";
import { FormGrid, FormSection } from "@/source/shared/ui";
import {
  CompanyReadonly,
  ContactFields,
  PasswordFields,
  ProfileAvatarUpload,
  ProfileForm,
  ProfileSaveProvider,
  SaveBar,
  useProfileShell,
  type UserProfile,
} from "@/source/entities/user";
import { ChangeEmailModal } from "@/source/features/profile/change-email";
import { DirectionsSection } from "@/source/features/profile/directions";
import { LicenseTermsForm } from "./LicenseTermsForm";

interface Props {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile | null) => void;
}

export function LicenseHolderProfileForm({ profile, onProfileUpdate }: Props) {
  const {
    form,
    avatarPreviewUrl,
    avatarError,
    isLoggingOut,
    isSaving,
    registerSave,
    handleAvatarSelect,
    submit,
  } = useProfileShell({ profile, onProfileUpdate });
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
      <ProfileForm onSubmit={submit}>
        <FormSection title="Контактные данные">
          <FormGrid>
            <ContactFields
              phone={form.phone}
              email={form.email}
              emailVerified={profile.email_verified}
              onChangePhone={form.setPhone}
              onChangeEmail={form.setEmail}
              onRequestEmailChange={() => setEmailModalOpen(true)}
            />
          </FormGrid>
          {profile.inn && profile.company_data && (
            <CompanyReadonly companyName={profile.company_data.value ?? ""} inn={profile.inn} />
          )}
        </FormSection>

        <ProfileSaveProvider register={registerSave}>
          <DirectionsSection
            role="LICENSE_HOLDER"
            licenseHolderExpertiseCard={
              <LicenseTermsForm profile={profile} onProfileUpdate={onProfileUpdate} />
            }
          />
        </ProfileSaveProvider>

        <FormSection title="Изменить пароль">
          <FormGrid>
            <PasswordFields
              password={form.password}
              repeatPassword={form.repeatPassword}
              onChangePassword={form.setPassword}
              onChangeRepeatPassword={form.setRepeatPassword}
            />
          </FormGrid>
        </FormSection>

        <SaveBar isSaving={isSaving} />
      </ProfileForm>

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
