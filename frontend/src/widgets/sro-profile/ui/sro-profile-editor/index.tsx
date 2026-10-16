"use client";

import { SroProfileProvider, useLoadSroProfile } from "@/entities/sro";
import type { SroDirection } from "@/entities/sro";
import { SroProfileForm } from "@/features/edit-sro-profile";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Направление СРО, анкету которого редактирует держатель документов. */
interface SroProfileEditorProps {
  direction: SroDirection;
}

/** Загружает анкету члена СРО выбранного направления и открывает её редактирование. */
export function SroProfileEditor({ direction }: SroProfileEditorProps) {
  const { profile, error } = useLoadSroProfile(direction);

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
    <SroProfileProvider
      key={direction}
      direction={direction}
      initialProfile={profile}
    >
      <SroProfileForm />
    </SroProfileProvider>
  );
}
