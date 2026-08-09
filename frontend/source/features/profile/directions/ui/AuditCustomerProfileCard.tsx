"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import {
  AuditCustomerProfileFields,
  fetchAuditCustomerProfile,
  saveAuditCustomerProfile,
} from "@/source/features/directions/audit";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

export function AuditCustomerProfileCard() {
  const { value, setValue } = useDirectionProfile({
    title: "Аудит СУПБ",
    load: fetchAuditCustomerProfile,
    save: saveAuditCustomerProfile,
  });

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;
  return <AuditCustomerProfileFields value={value} onChange={setValue} />;
}
