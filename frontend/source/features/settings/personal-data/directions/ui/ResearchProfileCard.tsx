"use client";

import { ResearchProfileFields } from "@/source/entities/directions/research";
import { useResearchProfile } from "../model/useResearchProfile";
import { DirectionCard } from "./DirectionCard";

/** Анкета «Научно-исследовательские работы». */
export function ResearchProfileCard() {
  const { profile, loadError, catalogs, isSaving, change, save } = useResearchProfile();

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={isSaving} onSave={save}>
      {profile && <ResearchProfileFields value={profile} onChange={change} catalogs={catalogs} />}
    </DirectionCard>
  );
}
