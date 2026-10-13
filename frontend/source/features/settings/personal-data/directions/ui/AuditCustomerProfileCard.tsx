"use client";

import { AuditCustomerProfileFields } from "@/source/entities/directions/audit";
import { useAuditCustomerProfile } from "../model/useAuditCustomerProfile";
import { DirectionCard } from "./DirectionCard";

/** Анкета заказчика «Аудит СУПБ». */
export function AuditCustomerProfileCard() {
  const { profile, loadError, isSaving, change, save } = useAuditCustomerProfile();

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={isSaving} onSave={save}>
      {profile && <AuditCustomerProfileFields value={profile} onChange={change} />}
    </DirectionCard>
  );
}
