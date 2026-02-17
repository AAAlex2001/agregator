"use client";

import React, { useEffect, useState } from "react";
import { Button, Loader } from "@/app/components";
import Title from "@/app/components/Typography/Title";
import Subtitle from "@/app/components/Typography/Subtitle";
import { Input } from "@/app/components/";
import AuthHeader from "@/app/landing/header/AuthHeader";
import { fetchProfile, updateProfile, changePassword } from "./api";
import type { UserProfile } from "./api";
import styles from "./settings.module.scss";

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [activeSection, setActiveSection] = useState<"personal" | "finance">("personal");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

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
      setSaveError("Не удалось загрузить профиль");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveMessage(null);
    setSaveError(null);

    try {
      if (activeSection === "personal") {
        const updated = await updateProfile({
          first_name: firstName,
          last_name: lastName,
          phone: phone || undefined,
          email: email || undefined,
        });
        setProfile(updated);

        if (password) {
          if (password !== repeatPassword) {
            setSaveError("Пароли не совпадают");
            setIsSaving(false);
            return;
          }
          if (password.length < 8) {
            setSaveError("Пароль должен быть не менее 8 символов");
            setIsSaving(false);
            return;
          }
          await changePassword(password, repeatPassword);
          setPassword("");
          setRepeatPassword("");
        }

        setSaveMessage("Данные сохранены");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка сохранения";
      setSaveError(message);
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
          <Subtitle text="Управляйте личными данными и финансами" className={styles.pageSubtitle} />
        </div>

        <div className={styles.content}>
          <div className={styles.buttons}>
            <Button variant="settings" size="sm" onClick={() => setActiveSection("personal")} isActive={activeSection === "personal"}>
              Личные данные
            </Button>
            <Button variant="settings" size="sm" onClick={() => setActiveSection("finance")} isActive={activeSection === "finance"}>
              Финансы
            </Button>
          </div>

          {isLoadingProfile ? (
            <div className={styles.loaderWrapper}>
              <Loader label="" size="lg" />
            </div>
          ) : activeSection === "personal" ? (
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
          ) : (
            <div className={styles.finance}>
              <div className={styles.infoContentFinance}>
                <Subtitle text="Баланс: 150 000р" className={styles.subtitle} />
                <div className={styles.financeButtons}>
                  <Button variant="chat" size="md" fullWidth onClick={() => {}}>
                    Пополнить
                  </Button>
                  <Button variant="outline" size="md" fullWidth onClick={() => {}}>
                    Вывести средства
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {saveMessage && <p className={styles.successMessage}>{saveMessage}</p>}
        {saveError && <p className={styles.errorMessage}>{saveError}</p>}

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
