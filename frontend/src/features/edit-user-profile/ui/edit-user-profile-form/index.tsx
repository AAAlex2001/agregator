"use client";

import type { ChangeEvent, ReactNode } from "react";
import type { UserProfile } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { FormGrid } from "@/shared/ui/form-grid";
import { FormSection } from "@/shared/ui/form-section";
import { PhoneInput } from "@/shared/ui/phone-input";
import { TextInput } from "@/shared/ui/text-input";
import { useEditUserProfile } from "../../model/use-edit-user-profile";

/** Профиль для заполнения формы и отдельное действие изменения почты. */
interface EditUserProfileFormProps {
  profile: UserProfile;
  withName: boolean;
  emailField: ReactNode;
}

/** Показывает имя, фамилию и контакты в прежней секции персональных данных. */
export function EditUserProfileForm({
  profile,
  withName,
  emailField,
}: EditUserProfileFormProps) {
  const form = useEditUserProfile(profile);

  /** Передаёт введённую фамилию в черновик. */
  function changeLastName(event: ChangeEvent<HTMLInputElement>) {
    form.changeLastName(event.target.value);
  }

  /** Передаёт введённое имя в черновик. */
  function changeFirstName(event: ChangeEvent<HTMLInputElement>) {
    form.changeFirstName(event.target.value);
  }

  /** Передаёт введённый телефон для форматирования. */
  function changePhone(event: ChangeEvent<HTMLInputElement>) {
    form.changePhone(event.target.value);
  }

  return (
    <FormSection
      title={withName ? "Персональные данные" : "Контактные данные"}
    >
      <FormGrid>
        {withName && (
          <>
            <TextInput
              id="profile-last-name"
              placeholder="Фамилия"
              aria-label="Фамилия"
              autoComplete="family-name"
              value={form.fields.lastName}
              onChange={changeLastName}
            />
            <TextInput
              id="profile-first-name"
              placeholder="Имя"
              aria-label="Имя"
              autoComplete="given-name"
              value={form.fields.firstName}
              onChange={changeFirstName}
            />
          </>
        )}
        <PhoneInput
          id="profile-phone"
          placeholder="+7-999-999-99-12"
          aria-label="Телефон"
          autoComplete="tel"
          value={form.fields.phone}
          onChange={changePhone}
        />
        {emailField}
      </FormGrid>

      <Button
        variant="chat"
        size="md"
        fullWidth
        isLoading={form.isSaving}
        onClick={form.save}
      >
        Сохранить
      </Button>
    </FormSection>
  );
}
