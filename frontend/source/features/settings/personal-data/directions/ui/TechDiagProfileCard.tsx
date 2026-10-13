"use client";

import { TechDiagProfileFields } from "@/source/entities/directions/tech-diag";
import { SavedDocumentsField } from "@/source/entities/directions/shared";
import { useTechDiagProfile } from "../model/useTechDiagProfile";
import { DirectionCard } from "./DirectionCard";

/** Анкета «Техническое освидетельствование и диагностирование» с квалификационными удостоверениями. */
export function TechDiagProfileCard() {
  const { profile, loadError, catalogs, isSaving, isUploading, change, save, uploadDocuments, removeDocument } =
    useTechDiagProfile();

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={isSaving} onSave={save}>
      {profile && (
        <>
          <TechDiagProfileFields value={profile} onChange={change} catalogs={catalogs} />
          <SavedDocumentsField
            label="Квалификационные удостоверения — до 10 документов"
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
