"use client";

import { useLoadAuditHolderProfile } from "@/entities/audit";
import { AuditHolderProfileForm } from "@/features/edit-audit-holder-profile";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Загружает анкету инспекционного органа и открывает её редактирование. */
export function AuditHolderProfileEditor() {
  const { profile, options, error } = useLoadAuditHolderProfile();

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
    <AuditHolderProfileForm
      initialProfile={profile}
      options={options}
    />
  );
}
