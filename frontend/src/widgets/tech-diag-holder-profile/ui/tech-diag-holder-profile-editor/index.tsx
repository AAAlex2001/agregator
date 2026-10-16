"use client";

import { useLoadTechDiagHolderProfile } from "@/entities/tech-diag";
import { TechDiagHolderProfileForm } from "@/features/edit-tech-diag-holder-profile";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Загружает анкету лаборатории НК и открывает её редактирование. */
export function TechDiagHolderProfileEditor() {
  const { profile, options, error } = useLoadTechDiagHolderProfile();

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
    <TechDiagHolderProfileForm
      initialProfile={profile}
      options={options}
    />
  );
}
