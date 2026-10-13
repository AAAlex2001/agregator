"use client";

import { CadastralProfileFields } from "@/source/entities/directions/cadastral";
import { SavedDocumentsField, SavedFileField } from "@/source/entities/directions/shared";
import { useCadastralProfile } from "../model/useCadastralProfile";
import { DirectionCard } from "./DirectionCard";

/** Анкета «Кадастровые работы» с дипломом, аттестатом и документами. */
export function CadastralProfileCard() {
  const cadastral = useCadastralProfile();
  const { profile, loadError } = cadastral;

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={cadastral.isSaving} onSave={cadastral.save}>
      {profile && (
        <>
          <CadastralProfileFields value={profile} onChange={cadastral.change} />
          <SavedFileField
            label="Диплом об образовании"
            file={profile.education_diploma}
            isBusy={cadastral.isUploading}
            onUpload={cadastral.uploadDiploma}
          />
          <SavedFileField
            label="Квалификационный аттестат"
            file={profile.certificate_file}
            isBusy={cadastral.isUploading}
            onUpload={cadastral.uploadCertificate}
          />
          <SavedDocumentsField
            label="Дипломы, аттестаты, курсы"
            documents={profile.documents}
            isBusy={cadastral.isUploading}
            onUpload={cadastral.uploadDocuments}
            onRemove={cadastral.removeDocument}
          />
        </>
      )}
    </DirectionCard>
  );
}
