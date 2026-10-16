"use client";

import {
  ResearchProfileProvider,
  useLoadResearchProfile,
} from "@/entities/research";
import { ResearchProfileForm } from "@/features/edit-research-profile";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Загружает анкету исследователя и открывает её редактирование. */
export function ResearchProfileEditor() {
  const { profile, options, error } = useLoadResearchProfile();

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
    <ResearchProfileProvider initialProfile={profile}>
      <ResearchProfileForm options={options} />
    </ResearchProfileProvider>
  );
}
