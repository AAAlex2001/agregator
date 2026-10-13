"use client";

import { DesignHolderProfileFields } from "@/source/entities/directions/design";
import { SavedDocumentsField } from "@/source/entities/directions/shared";
import { useDesignHolderProfile } from "../model/useDesignHolderProfile";
import { DirectionCard } from "./DirectionCard";

/** Анкета держателя документов «СРО проектировщиков». */
export function DesignHolderProfileCard() {
  const { profile, loadError, isSaving, isUploading, change, save, uploadDocuments, removeDocument } = useDesignHolderProfile();

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={isSaving} onSave={save}>
      {profile && (
        <>
          <DesignHolderProfileFields value={profile} onChange={change} />
          <SavedDocumentsField
            label="Дополнительные документы — до 10 файлов"
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
