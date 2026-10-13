"use client";

import { ForensicProfileFields } from "@/source/entities/directions/forensic";
import { SavedDocumentsField, SavedFileField } from "@/source/entities/directions/shared";
import { useForensicProfile } from "../model/useForensicProfile";
import { DirectionCard } from "./DirectionCard";

/** Анкета «Судебная экспертиза» с дипломом и документами о дополнительном образовании. */
export function ForensicProfileCard() {
  const forensic = useForensicProfile();
  const { profile, loadError } = forensic;

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={forensic.isSaving} onSave={forensic.save}>
      {profile && (
        <>
          <ForensicProfileFields value={profile} onChange={forensic.change} />
          <SavedFileField
            label="Диплом об образовании"
            file={profile.education_diploma}
            isBusy={forensic.isUploading}
            onUpload={forensic.uploadDiploma}
          />
          <SavedDocumentsField
            label="Документы о дополнительном образовании"
            documents={profile.documents}
            isBusy={forensic.isUploading}
            onUpload={forensic.uploadDocuments}
            onRemove={forensic.removeDocument}
          />
        </>
      )}
    </DirectionCard>
  );
}
