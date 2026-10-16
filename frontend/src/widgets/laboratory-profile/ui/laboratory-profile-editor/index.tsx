"use client";

import {
  LaboratoryProfileProvider,
  useLoadLaboratoryProfile,
} from "@/entities/laboratory";
import { LaboratoryProfileForm } from "@/features/edit-laboratory-profile";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Загружает анкету лаборатории и открывает её редактирование. */
export function LaboratoryProfileEditor() {
  const { profile, error } = useLoadLaboratoryProfile();

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
    <LaboratoryProfileProvider initialProfile={profile}>
      <LaboratoryProfileForm />
    </LaboratoryProfileProvider>
  );
}
