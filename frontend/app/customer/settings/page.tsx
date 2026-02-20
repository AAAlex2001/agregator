"use client";

import React, { useEffect, useState } from "react";
import { Button, Loader } from "@/app/components";
import { NotificationProvider, useNotifications } from "@/app/components/Notifications";
import Title from "@/app/components/Typography/Title";
import Subtitle from "@/app/components/Typography/Subtitle";
import { Input } from "@/app/components/";
import AuthHeader from "@/app/landing/header/AuthHeader";
import { fetchProfile, updateProfile, changePassword } from "@/app/settings/api";
import type { UserProfile } from "@/app/settings/api";
import styles from "./settings.module.scss";

function CustomerSettingsContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const { showSuccess, showError } = useNotifications();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const data = await fetchProfile();
      setProfile(data);
      setLastName(data.last_name || "");
      setFirstName(data.first_name || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");
    } catch {
      showError("Не удалось загрузить профиль");
    } finally {
      setIsLoadingProfile(false);
    }
  };

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
      setProfile(updated);

      if (password) {
        if (password !== repeatPassword) {
          showError("Пароли не совпадают");
          setIsSaving(false);
          return;
        }
        if (password.length < 8) {
          showError("Пароль должен быть не менее 8 символов");
          setIsSaving(false);
          return;
        }
        await changePassword(password, repeatPassword);
        setPassword("");
        setRepeatPassword("");
      }

      showSuccess("Данные сохранены");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка сохранения";
      showError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AuthHeader />
      <div className={styles.wrapper}>
        <div className={styles.pageHead}>
          <Title text="Настройки профиля" as="h1" className={styles.pageTitle} />
          <Subtitle text="Управляйте личными данными" className={styles.pageSubtitle} />
        </div>

        <div className={styles.content}>
          <div className={styles.buttons}>
            <Button variant="settings" size="sm" isActive>
              Личные данные
            </Button>
          </div>

          {isLoadingProfile ? (
            <div className={styles.loaderWrapper}>
              <Loader label="" size="lg" />
            </div>
          ) : (
            <div className={styles.data}>
              <Subtitle text="Персональные данные" className={styles.subtitle} />
              <div className={styles.info}>
                <div className={styles.infoContent}>
                  <Input
                    type="text"
                    placeholder="Фамилия"
                    aria-label="Фамилия"
                    value={lastName}
                    variant="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                  />
                  <Input
                    type="tel"
                    placeholder="Введите телефон"
                    aria-label="Телефон"
                    value={phone}
                    variant="phone"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Имя"
                    aria-label="Имя"
                    value={firstName}
                    variant="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Введите электронную почту"
                    aria-label="Электронная почта"
                    value={email}
                    variant="email"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Subtitle text="Изменить пароль" className={styles.subtitle} />
              <div className={styles.passwordSection}>
                <div className={styles.infoContent}>
                  <Input
                    type="password"
                    placeholder="Введите новый пароль"
                    aria-label="Пароль"
                    variant="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Повторите новый пароль"
                    aria-label="Повторите пароль"
                    variant="password"
                    value={repeatPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.saveButtonWrapper}>
          <Button
            variant="chat"
            size="md"
            className={styles.saveButton}
            onClick={() => void handleSave()}
            isLoading={isSaving}
          >
            Сохранить изменения
          </Button>
        </div>
      </div>
    </>
  );
}

export default function CustomerSettingsPage() {
  return (
    <NotificationProvider>
      <React.Suspense
        fallback={
          <>
            <AuthHeader />
            <div className={styles.wrapper}>
              <div className={styles.loaderWrapper}>
                <Loader label="" size="lg" />
              </div>
            </div>
          </>
        }
      >
        <CustomerSettingsContent />
      </React.Suspense>
    </NotificationProvider>
  );
}
