"use client";

import type { ReactNode } from "react";
import type { UserProfile } from "@/source/entities/user";
import Button from "@/source/shared/ui/Button";
import { FormGrid, FormSection } from "@/source/shared/ui";
import { PhoneInput, TextInput } from "@/source/shared/ui/Inputs";
import { useUpdateInfo } from "../model/useUpdateInfo";

interface InfoFormProps {
  profile: UserProfile;
  withName: boolean;
  emailField: ReactNode;
}

/** Персональные данные: фамилия, имя, телефон и поле почты (приходит слотом). Держателю документов имя не нужно. */
export function InfoForm({ profile, withName, emailField }: InfoFormProps) {
  const { fields, isSaving, change, save } = useUpdateInfo(profile);

  return (
    <FormSection title={withName ? "Персональные данные" : "Контактные данные"}>
      <FormGrid>
        {withName && (
          <>
            <TextInput
              id="profile-last-name"
              placeholder="Фамилия"
              aria-label="Фамилия"
              autoComplete="family-name"
              value={fields.lastName}
              onChange={(event) => change({ ...fields, lastName: event.target.value })}
            />
            <TextInput
              id="profile-first-name"
              placeholder="Имя"
              aria-label="Имя"
              autoComplete="given-name"
              value={fields.firstName}
              onChange={(event) => change({ ...fields, firstName: event.target.value })}
            />
          </>
        )}
        <PhoneInput
          id="profile-phone"
          placeholder="+7-999-999-99-12"
          aria-label="Телефон"
          autoComplete="tel"
          value={fields.phone}
          onChange={(event) => change({ ...fields, phone: event.target.value })}
        />
        {emailField}
      </FormGrid>

      <Button variant="chat" size="md" fullWidth isLoading={isSaving} onClick={save}>
        Сохранить
      </Button>
    </FormSection>
  );
}
