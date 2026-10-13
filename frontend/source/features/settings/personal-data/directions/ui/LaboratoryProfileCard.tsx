"use client";

import { LaboratoryProfileFields } from "@/source/entities/directions/laboratory";
import { useLaboratoryProfile } from "../model/useLaboratoryProfile";
import { DirectionCard } from "./DirectionCard";

/** Анкета «Лабораторные исследования». */
export function LaboratoryProfileCard() {
  const { profile, loadError, isSaving, change, save } = useLaboratoryProfile();

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={isSaving} onSave={save}>
      {profile && <LaboratoryProfileFields value={profile} onChange={change} />}
    </DirectionCard>
  );
}
