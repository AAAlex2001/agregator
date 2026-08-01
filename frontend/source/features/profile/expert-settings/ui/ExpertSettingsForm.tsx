"use client";

import { useState } from "react";
import { FormGrid, FormSection } from "@/source/shared/ui";
import {
  ContactFields,
  NameFields,
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
import { ExpertLocationSection } from "./ExpertLocationSection";
import { ExpertContactOfferSection } from "./ExpertContactOfferSection";

interface Props {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile | null) => void;
}

export function ExpertSettingsForm({ profile, onProfileUpdate }: Props) {
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
        <FormSection title="Персональные данные">
          <FormGrid>
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
          </FormGrid>
        </FormSection>

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

        <ProfileSaveProvider register={registerSave}>
          <ExpertLocationSection profile={profile} />

          <DirectionsSection role="EXPERT" />

          <FormSection>
            <ExpertContactOfferSection />
          </FormSection>
        </ProfileSaveProvider>

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
