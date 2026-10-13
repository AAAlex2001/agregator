"use client";

import { TechDiagHolderProfileFields } from "@/source/entities/directions/tech-diag";
import { useTechDiagHolderProfile } from "../model/useTechDiagHolderProfile";
import { DirectionCard } from "./DirectionCard";

/** Анкета лаборатории НК (держатель документов). */
export function TechDiagHolderProfileCard() {
  const { profile, loadError, catalogs, isSaving, change, save } = useTechDiagHolderProfile();

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={isSaving} onSave={save}>
      {profile && <TechDiagHolderProfileFields value={profile} onChange={change} catalogs={catalogs} />}
    </DirectionCard>
  );
}
