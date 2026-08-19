"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import {
  deleteSurveyHolderDocument,
  SurveyHolderProfileFields,
  fetchSurveyHolderProfile,
  saveSurveyHolderProfile,
  uploadSurveyHolderDocument,
  type SurveyHolderProfile,
} from "@/source/features/directions/survey";
import { SavedDocumentsField } from "@/source/features/directions/shared/ui/SavedDocumentsField";
import { uploadDirectionFiles } from "@/source/features/directions/shared/model/files";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

function mergeDocuments(current: SurveyHolderProfile, server: SurveyHolderProfile): SurveyHolderProfile {
  return { ...current, documents: server.documents };
}

export function SurveyHolderProfileCard() {
  const { value, setValue, isBusy, applyServerUpdate } = useDirectionProfile({
    title: "Инженерные изыскания",
    load: fetchSurveyHolderProfile,
    save: saveSurveyHolderProfile,
  });

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;

  return (
    <>
      <SurveyHolderProfileFields value={value} onChange={setValue} />
      <SavedDocumentsField
        label="Дополнительные документы — до 10 файлов"
        documents={value.documents}
        isBusy={isBusy}
        onUpload={(files) =>
          applyServerUpdate(
            () => uploadDirectionFiles(files, uploadSurveyHolderDocument),
            mergeDocuments,
          )
        }
        onRemove={(url) => applyServerUpdate(() => deleteSurveyHolderDocument(url), mergeDocuments)}
      />
    </>
  );
}
