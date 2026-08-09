"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/source/shared/ui/Skeleton";
import {
  AuditExpertProfileFields,
  deleteAuditDocument,
  emptyAuditCatalogs,
  fetchAuditCatalogs,
  fetchAuditExpertProfile,
  saveAuditExpertProfile,
  uploadAuditDocument,
  type AuditCatalogs,
  type AuditExpertProfile,
} from "@/source/features/directions/audit";
import { SavedDocumentsField } from "@/source/features/directions/shared/ui/SavedDocumentsField";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

function mergeDocuments(current: AuditExpertProfile, server: AuditExpertProfile): AuditExpertProfile {
  return { ...current, documents: server.documents };
}

export function AuditExpertProfileCard() {
  const [catalogs, setCatalogs] = useState<AuditCatalogs>(emptyAuditCatalogs);
  const { value, setValue, isBusy, applyServerUpdate } = useDirectionProfile({
    title: "Аудит СУПБ",
    load: fetchAuditExpertProfile,
    save: saveAuditExpertProfile,
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

  return (
    <>
      <AuditExpertProfileFields value={value} onChange={setValue} catalogs={catalogs} />
      <SavedDocumentsField
        label="Дипломы, аттестаты, курсы"
        documents={value.documents}
        isBusy={isBusy}
        onUpload={(file) => applyServerUpdate(() => uploadAuditDocument(file), mergeDocuments)}
        onRemove={(url) => applyServerUpdate(() => deleteAuditDocument(url), mergeDocuments)}
      />
    </>
  );
}
