"use client";

import { useLoadExpertiseProfile } from "@/entities/expertise";
import { ExpertiseProfileForm } from "@/features/edit-expertise-profile";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Загружает анкету эксперта промышленной безопасности и открывает её редактирование. */
export function ExpertiseProfileEditor() {
  const { profile, error } = useLoadExpertiseProfile();

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

  if (!profile) {
    return <Skeleton className={styles.skeleton} />;
  }

  return <ExpertiseProfileForm initialProfile={profile} />;
}
