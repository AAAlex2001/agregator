"use client";

import { SurveyHolderProfileFields } from "@/source/entities/directions/survey";
import { SavedDocumentsField } from "@/source/entities/directions/shared";
import { useSurveyHolderProfile } from "../model/useSurveyHolderProfile";
import { DirectionCard } from "./DirectionCard";

/** Анкета держателя документов «СРО изыскателей». */
export function SurveyHolderProfileCard() {
  const { profile, loadError, isSaving, isUploading, change, save, uploadDocuments, removeDocument } = useSurveyHolderProfile();

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={isSaving} onSave={save}>
      {profile && (
        <>
          <SurveyHolderProfileFields value={profile} onChange={change} />
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
