"use client";

import {
  SurveyProfileProvider,
  useLoadSurveyProfile,
} from "@/entities/survey";
import { SurveyProfileForm } from "@/features/edit-survey-profile";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Загружает анкету изыскателя и открывает её редактирование. */
export function SurveyProfileEditor() {
  const { profile, options, error } = useLoadSurveyProfile();

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
    <SurveyProfileProvider initialProfile={profile}>
      <SurveyProfileForm options={options} />
    </SurveyProfileProvider>
  );
}
