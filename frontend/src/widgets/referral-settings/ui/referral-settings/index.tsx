"use client";

import { useUser } from "@/entities/user";
import { ReferralProgram } from "../referral-program";
import { ReferralSettingsSkeleton } from "../referral-settings-skeleton";
import styles from "./style.module.scss";

/** Вкладка «Приглашения»: программа открывается после подтверждения почты. */
export function ReferralSettings() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <ReferralSettingsSkeleton />;
  }

  if (!user?.email_verified) {
    return (
      <p className={styles.notice}>
        Подтвердите почту, чтобы приглашать коллег и получать плюсы.
      </p>
    );
  }

  return <ReferralProgram />;
}
