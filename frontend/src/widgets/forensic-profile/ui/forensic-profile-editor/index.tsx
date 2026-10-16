"use client";

import {
  ForensicProfileProvider,
  useLoadForensicProfile,
} from "@/entities/forensic";
import { ForensicProfileForm } from "@/features/edit-forensic-profile";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Загружает анкету судебного эксперта и открывает её редактирование. */
export function ForensicProfileEditor() {
  const { profile, error } = useLoadForensicProfile();

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

  return (
    <ForensicProfileProvider initialProfile={profile}>
      <ForensicProfileForm />
    </ForensicProfileProvider>
  );
}
