"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import {
  AuditCustomerProfileFields,
  auditCustomerProfileSchema,
  fetchAuditCustomerProfile,
  saveAuditCustomerProfile,
  type AuditCustomerProfile,
} from "@/source/features/directions/audit";
import { firstSchemaError } from "@/source/features/directions/shared/model/validate";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

function validate(profile: AuditCustomerProfile): string | null {
  return firstSchemaError(auditCustomerProfileSchema, profile);
}

export function AuditCustomerProfileCard() {
  const { value, setValue } = useDirectionProfile({
    title: "Аудит СУПБ",
    load: fetchAuditCustomerProfile,
    save: saveAuditCustomerProfile,
    validate,
  });

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;
  return <AuditCustomerProfileFields value={value} onChange={setValue} />;
}
