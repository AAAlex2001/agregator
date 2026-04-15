"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Tabs from "@/source/shared/ui/Tabs";
import Loader from "@/source/shared/ui/Loader";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { Header } from "@/source/widgets/header";
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

  const tabs = isExpert
    ? [{ id: "personal", label: "Личные данные" }, { id: "finance", label: "Финансы" }]
    : [{ id: "personal", label: "Личные данные" }];

  useEffect(() => {
    fetchProfile()
      .then(setProfile)
      .catch(() => setError("Не удалось загрузить профиль"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <Header />
      <div className={s.wrapper}>
        <div className={s.pageHead}>
          <Title text="Настройки профиля" as="h1" className={s.pageTitle} />
          <Subtitle
            text={isExpert ? "Управляйте личными данными и финансами" : "Управляйте личными данными"}
            className={s.pageSubtitle}
          />
        </div>
        <div className={s.content}>
          <Tabs
            variant="pill"
            tabs={tabs}
            activeTab={section}
            onTabChange={(id) => setSection(id as "personal" | "finance")}
          />

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
