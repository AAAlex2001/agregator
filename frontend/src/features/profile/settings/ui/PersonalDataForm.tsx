"use client";

import React, { useState } from "react";
import { Input, Button } from "@/shared/ui";
import Subtitle from "@/shared/ui/Typography/Subtitle";
import { useNotifications } from "@/shared/ui/Notifications";
import { updateProfile, changePassword, type UserProfile } from "../model/api";

interface PersonalDataFormProps {
  profile: UserProfile;
  onProfileUpdate: (p: UserProfile) => void;
  styles: Record<string, string>;
}

export function PersonalDataForm({ profile, onProfileUpdate, styles }: PersonalDataFormProps) {
  const [lastName, setLastName] = useState(profile.last_name || "");
  const [firstName, setFirstName] = useState(profile.first_name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [email, setEmail] = useState(profile.email || "");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const updated = await updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
        email: email || undefined,
      });
      onProfileUpdate(updated);

      if (password) {
        if (password !== repeatPassword) {
          showError("Пароли не совпадают");
          return;
        }
        if (password.length < 8) {
          showError("Пароль должен быть не менее 8 символов");
          return;
        }
        await changePassword(password, repeatPassword);
        setPassword("");
        setRepeatPassword("");
      }

      showSuccess("Данные сохранены");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className={styles.data}>
        <Subtitle text="Персональные данные" className={styles.subtitle} />
        <div className={styles.info}>
          <div className={styles.infoContent}>
            <Input type="text" placeholder="Фамилия" aria-label="Фамилия" value={lastName} variant="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} />
            <Input type="tel" placeholder="Введите телефон" aria-label="Телефон" value={phone} variant="phone"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} />
            <Input type="text" placeholder="Имя" aria-label="Имя" value={firstName} variant="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} />
            <Input type="email" placeholder="Введите электронную почту" aria-label="Электронная почта" value={email} variant="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
          </div>
        </div>
        <Subtitle text="Изменить пароль" className={styles.subtitle} />
        <div className={styles.passwordSection}>
          <div className={styles.infoContent}>
            <Input placeholder="Введите новый пароль" aria-label="Пароль" variant="password" value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
            <Input placeholder="Повторите новый пароль" aria-label="Повторите пароль" variant="password" value={repeatPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)} />
          </div>
        </div>
      </div>

      <div className={styles.saveButtonWrapper}>
        <Button variant="chat" size="md" className={styles.saveButton} onClick={() => void handleSave()} isLoading={isSaving}>
          Сохранить изменения
        </Button>
      </div>
    </>
  );
}
