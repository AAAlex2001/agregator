"use client";

import {
  TechDiagProfileProvider,
  useLoadTechDiagProfile,
} from "@/entities/tech-diag";
import { TechDiagProfileForm } from "@/features/edit-tech-diag-profile";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Загружает анкету специалиста НК и открывает её редактирование. */
export function TechDiagProfileEditor() {
  const { profile, options, error } = useLoadTechDiagProfile();

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
    <TechDiagProfileProvider initialProfile={profile}>
      <TechDiagProfileForm options={options} />
    </TechDiagProfileProvider>
  );
}
