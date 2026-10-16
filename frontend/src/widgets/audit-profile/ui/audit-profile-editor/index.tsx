"use client";

import {
  AuditExpertProfileProvider,
  useLoadAuditExpertProfile,
} from "@/entities/audit";
import { AuditProfileForm } from "@/features/edit-audit-profile";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Загружает анкету аудитора и открывает её редактирование. */
export function AuditProfileEditor() {
  const { profile, options, error } = useLoadAuditExpertProfile();

  if (error) {
    return (
      <p
        className={styles.error}
        role="alert"
      >
        {error}
      </p>
    );
  }

  if (!profile || !options) {
    return <Skeleton className={styles.skeleton} />;
  }

  return (
    <AuditExpertProfileProvider initialProfile={profile}>
      <AuditProfileForm options={options} />
    </AuditExpertProfileProvider>
  );
}
