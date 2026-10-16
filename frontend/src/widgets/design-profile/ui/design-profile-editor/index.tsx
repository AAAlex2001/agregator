"use client";

import {
  DesignProfileProvider,
  useLoadDesignProfile,
} from "@/entities/design";
import { DesignProfileForm } from "@/features/edit-design-profile";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Загружает анкету проектировщика и открывает её редактирование. */
export function DesignProfileEditor() {
  const { profile, options, error } = useLoadDesignProfile();

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
    <DesignProfileProvider initialProfile={profile}>
      <DesignProfileForm options={options} />
    </DesignProfileProvider>
  );
}
