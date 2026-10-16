"use client";

import {
  CadastralProfileProvider,
  useLoadCadastralProfile,
} from "@/entities/cadastral";
import { CadastralProfileForm } from "@/features/edit-cadastral-profile";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Загружает анкету кадастрового инженера и открывает её редактирование. */
export function CadastralProfileEditor() {
  const { profile, error } = useLoadCadastralProfile();

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
    <CadastralProfileProvider initialProfile={profile}>
      <CadastralProfileForm />
    </CadastralProfileProvider>
  );
}
