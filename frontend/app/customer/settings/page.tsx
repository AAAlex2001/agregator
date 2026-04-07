"use client";

import React, { useEffect, useState } from "react";
import { Button, Loader } from "@/shared/ui";
import { NotificationProvider, useNotifications } from "@/shared/ui/Notifications";
import Title from "@/shared/ui/Typography/Title";
import Subtitle from "@/shared/ui/Typography/Subtitle";
import AuthHeader from "@/widgets/header/AuthHeader";
import { fetchProfile, type UserProfile } from "@/features/profile/settings/model/api";
import { PersonalDataForm } from "@/features/profile/settings/ui/PersonalDataForm";
import styles from "./settings.module.scss";

function CustomerSettingsContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const { showError } = useNotifications();

  useEffect(() => {
    setIsLoadingProfile(true);
    fetchProfile()
      .then(setProfile)
      .catch(() => showError("Не удалось загрузить профиль"))
      .finally(() => setIsLoadingProfile(false));
  }, [showError]);

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

          {isLoadingProfile || !profile ? (
            <div className={styles.loaderWrapper}>
              <Loader label="" size="lg" />
            </div>
          ) : (
            <PersonalDataForm profile={profile} onProfileUpdate={setProfile} styles={styles} />
          )}
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
