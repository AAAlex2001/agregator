"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Loader } from "@/shared/ui";
import { NotificationProvider, useNotifications } from "@/shared/ui/Notifications";
import Title from "@/shared/ui/Typography/Title";
import Subtitle from "@/shared/ui/Typography/Subtitle";
import AuthHeader from "@/widgets/header/AuthHeader";
import { fetchProfile, type UserProfile } from "@/features/profile/settings/model/api";
import { PersonalDataForm } from "@/features/profile/settings/ui/PersonalDataForm";
import { FinancePanel } from "@/features/balance/finance-panel/ui/FinancePanel";
import styles from "./settings.module.scss";

function ExpertSettingsContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<"personal" | "finance">(
    searchParams.get("section") === "finance" ? "finance" : "personal",
  );
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

          {isLoadingProfile || !profile ? (
            <div className={styles.loaderWrapper}>
              <Loader label="" size="lg" />
            </div>
          ) : activeSection === "personal" ? (
            <PersonalDataForm profile={profile} onProfileUpdate={setProfile} styles={styles} />
          ) : (
            <FinancePanel
              balance={profile.balance ?? 0}
              onBalanceChange={(b) => setProfile((prev) => (prev ? { ...prev, balance: b } : prev))}
              returnUrl={typeof window !== "undefined" ? `${window.location.origin}/expert/settings?section=finance` : ""}
              styles={styles}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default function ExpertSettingsPage() {
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
        <ExpertSettingsContent />
      </React.Suspense>
    </NotificationProvider>
  );
}
