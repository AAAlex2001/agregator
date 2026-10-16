"use client";

import type { ChangeEvent } from "react";
import { Button } from "@/shared/ui/button";
import { FormGrid } from "@/shared/ui/form-grid";
import { FormSection } from "@/shared/ui/form-section";
import { PasswordInput } from "@/shared/ui/password-input";
import { useChangePasswordForm } from "../../model/use-change-password-form";

/** Показывает привычный блок нового пароля, повторного ввода и сохранения. */
export function ChangePasswordForm() {
  const form = useChangePasswordForm();

  /** Передаёт новый пароль в состояние формы. */
  function changePassword(event: ChangeEvent<HTMLInputElement>) {
    form.changePassword(event.target.value);
  }

  /** Передаёт повторный пароль в состояние формы. */
  function changeRepeatedPassword(event: ChangeEvent<HTMLInputElement>) {
    form.changeRepeatedPassword(event.target.value);
  }

  return (
    <FormSection title="Изменить пароль">
      <FormGrid>
        <PasswordInput
          id="profile-password"
          placeholder="Введите новый пароль"
          aria-label="Новый пароль"
          autoComplete="new-password"
          value={form.fields.password}
          onChange={changePassword}
        />
        <PasswordInput
          id="profile-password-repeat"
          placeholder="Повторите новый пароль"
          aria-label="Повторите пароль"
          autoComplete="new-password"
          value={form.fields.repeatedPassword}
          onChange={changeRepeatedPassword}
        />
      </FormGrid>

      <Button
        variant="chat"
        size="md"
        fullWidth
        isLoading={form.isSaving}
        disabled={!form.fields.password || !form.fields.repeatedPassword}
        onClick={form.save}
      >
        Сменить пароль
      </Button>
    </FormSection>
  );
}
