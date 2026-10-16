"use client";

import {
  EcologyProfileProvider,
  useLoadEcologyProfile,
} from "@/entities/ecology";
import { EcologyProfileForm } from "@/features/edit-ecology-profile";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Загружает анкету эколога и открывает её редактирование. */
export function EcologyProfileEditor() {
  const { profile, options, error } = useLoadEcologyProfile();

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
    <EcologyProfileProvider initialProfile={profile}>
      <EcologyProfileForm options={options} />
    </EcologyProfileProvider>
  );
}
