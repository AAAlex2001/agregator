"use client";

import {
  SurveyProfileFields,
  type SurveyDocumentGroup,
  type SurveyProfile,
} from "@/source/entities/directions/survey";
import { SavedDocumentsField, type DirectionFile } from "@/source/entities/directions/shared";
import { useSurveyProfile } from "../model/useSurveyProfile";
import { DirectionCard } from "./DirectionCard";

interface DocumentGroup {
  group: SurveyDocumentGroup;
  label: string;
  documents: DirectionFile[];
}

const documentGroups = (profile: SurveyProfile): DocumentGroup[] => [
  { group: "education", label: "Диплом об образовании — до 5 документов", documents: profile.education_documents },
  { group: "nok", label: "Свидетельства НОК — до 5 документов", documents: profile.nok_documents },
  { group: "nrs", label: "Уведомления о включении в НРС — до 5 документов", documents: profile.nrs_documents },
  { group: "qualification", label: "Повышение квалификации, курсы — до 5 документов", documents: profile.qualification_documents },
  { group: "rtn", label: "Протоколы аттестации РТН — до 5 документов", documents: profile.rtn_documents },
];

/** Анкета «Инженерные изыскания» с пятью группами документов: образование, НОК, НРС, курсы, аттестация РТН. */
export function SurveyProfileCard() {
  const survey = useSurveyProfile();
  const { profile, loadError } = survey;

  return (
    <DirectionCard isLoading={!profile} loadError={loadError} isSaving={survey.isSaving} onSave={survey.save}>
      {profile && (
        <>
          <SurveyProfileFields value={profile} onChange={survey.change} catalogs={survey.catalogs} />
          {documentGroups(profile).map(({ group, label, documents }) => (
            <SavedDocumentsField
              key={group}
              label={label}
              documents={documents}
              maxFiles={5}
              isBusy={survey.isUploading}
              onUpload={(files) => survey.uploadDocuments(group, files)}
              onRemove={(url) => survey.removeDocument(group, url)}
            />
          ))}
        </>
      )}
    </DirectionCard>
  );
}
