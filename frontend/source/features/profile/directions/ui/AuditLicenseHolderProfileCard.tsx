"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/source/shared/ui/Skeleton";
import {
  AuditLicenseHolderProfileFields,
  auditLicenseHolderProfileSchema,
  emptyAuditCatalogs,
  fetchAuditCatalogs,
  fetchAuditLicenseHolderProfile,
  saveAuditLicenseHolderProfile,
  type AuditCatalogs,
  type AuditLicenseHolderProfile,
} from "@/source/features/directions/audit";
import { firstSchemaError } from "@/source/features/directions/shared/model/validate";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

function validate(profile: AuditLicenseHolderProfile): string | null {
  return firstSchemaError(auditLicenseHolderProfileSchema, profile);
}

export function AuditLicenseHolderProfileCard() {
  const [catalogs, setCatalogs] = useState<AuditCatalogs>(emptyAuditCatalogs);
  const { value, setValue } = useDirectionProfile({
    title: "Аудит СУПБ",
    load: fetchAuditLicenseHolderProfile,
    save: saveAuditLicenseHolderProfile,
    validate,
  });

  useEffect(() => {
    let alive = true;
    fetchAuditCatalogs()
      .then((loaded) => alive && setCatalogs(loaded))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;
  return <AuditLicenseHolderProfileFields value={value} onChange={setValue} catalogs={catalogs} />;
}
