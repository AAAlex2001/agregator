"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import {
  deleteForensicDocument,
  fetchForensicProfile,
  ForensicProfileFields,
  forensicProfileSchema,
  saveForensicProfile,
  uploadForensicDiploma,
  uploadForensicDocument,
  type ForensicProfile,
} from "@/source/features/directions/forensic";
import { firstSchemaError } from "@/source/features/directions/shared/model/validate";
import { SavedDocumentsField } from "@/source/features/directions/shared/ui/SavedDocumentsField";
import { SavedFileField } from "@/source/features/directions/shared/ui/SavedFileField";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

function validate(profile: ForensicProfile): string | null {
  return firstSchemaError(forensicProfileSchema, profile);
}

function mergeFiles(current: ForensicProfile, server: ForensicProfile): ForensicProfile {
  return {
    ...current,
    education_diploma: server.education_diploma,
    documents: server.documents,
  };
}

export function ForensicProfileCard() {
  const { value, setValue, isBusy, applyServerUpdate } = useDirectionProfile({
    title: "Судебная экспертиза",
    load: fetchForensicProfile,
    save: saveForensicProfile,
    validate,
  });

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;

  return (
    <>
      <ForensicProfileFields value={value} onChange={setValue} />
      <SavedFileField
        label="Диплом об образовании"
        file={value.education_diploma}
        isBusy={isBusy}
        onUpload={(file) => applyServerUpdate(() => uploadForensicDiploma(file), mergeFiles)}
      />
      <SavedDocumentsField
        label="Документы о дополнительном образовании"
        documents={value.documents}
        isBusy={isBusy}
        onUpload={(file) => applyServerUpdate(() => uploadForensicDocument(file), mergeFiles)}
        onRemove={(url) => applyServerUpdate(() => deleteForensicDocument(url), mergeFiles)}
      />
    </>
  );
}
