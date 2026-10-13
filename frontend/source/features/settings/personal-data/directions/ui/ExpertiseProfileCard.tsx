"use client";

import { ExpertiseProfileFields } from "@/source/entities/directions/expertise";
import { useExpertiseProfile } from "../model/useExpertiseProfile";
import { DirectionCard } from "./DirectionCard";

/** Анкета «Экспертиза промышленной безопасности». */
export function ExpertiseProfileCard() {
  const { profile, loadError, isSaving, change, save } = useExpertiseProfile();

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={isSaving} onSave={save}>
      {profile && <ExpertiseProfileFields value={profile} onChange={change} />}
    </DirectionCard>
  );
}
