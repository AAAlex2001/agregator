"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/source/shared/ui/Button";
import Loader from "@/source/shared/ui/Loader";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import AuthHeader from "@/widgets/header/AuthHeader";
import { fetchProfile, PersonalDataForm } from "@/source/features/profile/settings";
import type { UserProfile } from "@/source/features/profile/settings";
import { FinancePanel } from "@/source/features/finance";
import s from "./SettingsWidget.module.scss";

export function SettingsWidget() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState<"personal" | "finance">(
    searchParams.get("section") === "finance" ? "finance" : "personal",
  );

  const isExpert = profile?.role === "EXPERT";

  useEffect(() => {
    fetchProfile()
      .then(setProfile)
      .catch(() => setError("Не удалось загрузить профиль"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <AuthHeader />
      <div className={s.wrapper}>
        <div className={s.pageHead}>
          <Title text="Настройки профиля" as="h1" className={s.pageTitle} />
          <Subtitle
            text={isExpert ? "Управляйте личными данными и финансами" : "Управляйте личными данными"}
            className={s.pageSubtitle}
          />
        </div>
        <div className={s.content}>
          <div className={s.buttons}>
            <Button variant="settings" size="sm"
              onClick={() => setSection("personal")} isActive={section === "personal"}>
              Личные данные
            </Button>
            {isExpert && (
              <Button variant="settings" size="sm"
                onClick={() => setSection("finance")} isActive={section === "finance"}>
                Финансы
              </Button>
            )}
          </div>

          {error && <p className={s.error}>{error}</p>}

          {isLoading || !profile ? (
            <div className={s.loaderWrapper}><Loader label="" size="lg" /></div>
          ) : section === "personal" || !isExpert ? (
            <PersonalDataForm profile={profile} onProfileUpdate={setProfile} />
          ) : (
            <FinancePanel
              balance={profile.balance ?? 0}
              onBalanceChange={(b) => setProfile((prev) => prev ? { ...prev, balance: b } : prev)}
              returnUrl={typeof window !== "undefined"
                ? `${window.location.origin}/settings?section=finance`
                : ""}
            />
          )}
        </div>
      </div>
    </>
  );
}
