"use client";

import { EcologyProfileFields } from "@/source/entities/directions/ecology";
import { SavedDocumentsField } from "@/source/entities/directions/shared";
import { useEcologyProfile } from "../model/useEcologyProfile";
import { DirectionCard } from "./DirectionCard";

/** Анкета «Экологическое сопровождение предприятий» с документами о квалификации. */
export function EcologyProfileCard() {
  const { profile, loadError, catalogs, isSaving, isUploading, change, save, uploadDocuments, removeDocument } =
    useEcologyProfile();

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={isSaving} onSave={save}>
      {profile && (
        <>
          <EcologyProfileFields value={profile} onChange={change} catalogs={catalogs} />
          <SavedDocumentsField
            label="Подтверждение квалификационных требований — до 10 документов"
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
