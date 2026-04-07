"use client";

import React from "react";
import { Input, Button } from "@/shared/ui";
import Subtitle from "@/shared/ui/Typography/Subtitle";
import { useNotifications } from "@/shared/ui/Notifications";
import { usePersonalDataState } from "../model/state";
import { handleSaveProfile } from "../model/actions";
import type { UserProfile } from "../model/types";

interface PersonalDataFormProps {
  profile: UserProfile;
  onProfileUpdate: (p: UserProfile) => void;
  styles: Record<string, string>;
}

export function PersonalDataForm({ profile, onProfileUpdate, styles }: PersonalDataFormProps) {
  const state = usePersonalDataState({
    firstName: profile.first_name || "",
    lastName: profile.last_name || "",
    phone: profile.phone || "",
    email: profile.email || "",
  });
  const { showSuccess, showError } = useNotifications();

  const handleSave = async () => {
    if (state.isSaving) return;
    state.setIsSaving(true);
    await handleSaveProfile(
      {
        firstName: state.firstName,
        lastName: state.lastName,
        phone: state.phone,
        email: state.email,
        password: state.password,
        repeatPassword: state.repeatPassword,
      },
      (updated) => {
        onProfileUpdate(updated);
        state.setPassword("");
        state.setRepeatPassword("");
        showSuccess("Данные сохранены");
      },
      showError,
    );
    state.setIsSaving(false);
  };

  return (
    <>
      <div className={styles.data}>
        <Subtitle text="Персональные данные" className={styles.subtitle} />
        <div className={styles.info}>
          <div className={styles.infoContent}>
            <Input type="text" placeholder="Фамилия" aria-label="Фамилия" value={state.lastName} variant="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setLastName(e.target.value)} />
            <Input type="tel" placeholder="Введите телефон" aria-label="Телефон" value={state.phone} variant="phone"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setPhone(e.target.value)} />
            <Input type="text" placeholder="Имя" aria-label="Имя" value={state.firstName} variant="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setFirstName(e.target.value)} />
            <Input type="email" placeholder="Введите электронную почту" aria-label="Электронная почта" value={state.email} variant="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setEmail(e.target.value)} />
          </div>
        </div>
        <Subtitle text="Изменить пароль" className={styles.subtitle} />
        <div className={styles.passwordSection}>
          <div className={styles.infoContent}>
            <Input placeholder="Введите новый пароль" aria-label="Пароль" variant="password" value={state.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setPassword(e.target.value)} />
            <Input placeholder="Повторите новый пароль" aria-label="Повторите пароль" variant="password" value={state.repeatPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setRepeatPassword(e.target.value)} />
          </div>
        </div>
      </div>

      <div className={styles.saveButtonWrapper}>
        <Button variant="chat" size="md" className={styles.saveButton} onClick={() => void handleSave()} isLoading={state.isSaving}>
          Сохранить изменения
        </Button>
      </div>
    </>
  );
}
