"use client";

import Button from "@/source/shared/ui/Button";
import { FormGrid, FormSection } from "@/source/shared/ui";
import { PasswordInput } from "@/source/shared/ui/Inputs";
import { useChangePassword } from "../model/useChangePassword";

/** Блок «Изменить пароль»: новый пароль, повтор и кнопка сохранения. */
export function PasswordForm() {
  const { fields, isSaving, change, save } = useChangePassword();

  return (
    <FormSection title="Изменить пароль">
      <FormGrid>
        <PasswordInput
          id="profile-password"
          placeholder="Введите новый пароль"
          aria-label="Новый пароль"
          autoComplete="new-password"
          value={fields.password}
          onChange={(event) => change({ ...fields, password: event.target.value })}
        />
        <PasswordInput
          id="profile-password-repeat"
          placeholder="Повторите новый пароль"
          aria-label="Повторите пароль"
          autoComplete="new-password"
          value={fields.repeatPassword}
          onChange={(event) => change({ ...fields, repeatPassword: event.target.value })}
        />
      </FormGrid>

      <Button
        variant="chat"
        size="md"
        fullWidth
        isLoading={isSaving}
        disabled={!fields.password || !fields.repeatPassword}
        onClick={save}
      >
        Сменить пароль
      </Button>
    </FormSection>
  );
}
