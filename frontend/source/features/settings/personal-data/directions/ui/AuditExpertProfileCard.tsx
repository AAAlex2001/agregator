"use client";

import { AuditExpertProfileFields } from "@/source/entities/directions/audit";
import { SavedDocumentsField } from "@/source/entities/directions/shared";
import { useAuditExpertProfile } from "../model/useAuditExpertProfile";
import { DirectionCard } from "./DirectionCard";

/** Анкета исполнителя «Аудит СУПБ» с дипломами и аттестатами. */
export function AuditExpertProfileCard() {
  const { profile, loadError, catalogs, isSaving, isUploading, change, save, uploadDocuments, removeDocument } =
    useAuditExpertProfile();

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={isSaving} onSave={save}>
      {profile && (
        <>
          <AuditExpertProfileFields value={profile} onChange={change} catalogs={catalogs} />
          <SavedDocumentsField
            label="Дипломы, аттестаты, курсы"
            documents={profile.documents}
            isBusy={isUploading}
            onUpload={uploadDocuments}
            onRemove={removeDocument}
          />
        </>
      )}
    </DirectionCard>
  );
}
