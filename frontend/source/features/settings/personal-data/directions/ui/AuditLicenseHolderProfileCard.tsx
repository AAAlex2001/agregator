"use client";

import { AuditLicenseHolderProfileFields } from "@/source/entities/directions/audit";
import { useAuditLicenseHolderProfile } from "../model/useAuditLicenseHolderProfile";
import { DirectionCard } from "./DirectionCard";

/** Анкета держателя документов «Аудит СУПБ». */
export function AuditLicenseHolderProfileCard() {
  const { profile, loadError, catalogs, isSaving, change, save } = useAuditLicenseHolderProfile();

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={isSaving} onSave={save}>
      {profile && <AuditLicenseHolderProfileFields value={profile} onChange={change} catalogs={catalogs} />}
    </DirectionCard>
  );
}
