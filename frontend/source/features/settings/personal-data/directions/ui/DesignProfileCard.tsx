"use client";

import {
  DesignProfileFields,
  type DesignDocumentGroup,
  type DesignProfile,
} from "@/source/entities/directions/design";
import { SavedDocumentsField, type DirectionFile } from "@/source/entities/directions/shared";
import { useDesignProfile } from "../model/useDesignProfile";
import { DirectionCard } from "./DirectionCard";

interface DocumentGroup {
  group: DesignDocumentGroup;
  label: string;
  documents: DirectionFile[];
}

const documentGroups = (profile: DesignProfile): DocumentGroup[] => [
  { group: "education", label: "Диплом об образовании — до 5 документов", documents: profile.education_documents },
  { group: "nok", label: "Свидетельства НОК — до 5 документов", documents: profile.nok_documents },
  { group: "nrs", label: "Уведомления о включении в НРС — до 5 документов", documents: profile.nrs_documents },
  { group: "qualification", label: "Повышение квалификации, курсы — до 5 документов", documents: profile.qualification_documents },
  { group: "rtn", label: "Протоколы аттестации РТН — до 5 документов", documents: profile.rtn_documents },
];

/** Анкета «Проектирование» с пятью группами документов: образование, НОК, НРС, курсы, аттестация РТН. */
export function DesignProfileCard() {
  const design = useDesignProfile();
  const { profile, loadError } = design;

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={design.isSaving} onSave={design.save}>
      {profile && (
        <>
          <DesignProfileFields value={profile} onChange={design.change} catalogs={design.catalogs} />
          {documentGroups(profile).map(({ group, label, documents }) => (
            <SavedDocumentsField
              key={group}
              label={label}
              documents={documents}
              maxFiles={5}
              isBusy={design.isUploading}
              onUpload={(files) => design.uploadDocuments(group, files)}
              onRemove={(url) => design.removeDocument(group, url)}
            />
          ))}
        </>
      )}
    </DirectionCard>
  );
}
