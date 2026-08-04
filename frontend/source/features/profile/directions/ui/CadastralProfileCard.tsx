"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import {
  CadastralProfileFields,
  cadastralProfileSchema,
  deleteCadastralDocument,
  fetchCadastralProfile,
  saveCadastralProfile,
  uploadCadastralCertificate,
  uploadCadastralDiploma,
  uploadCadastralDocument,
  type CadastralProfile,
} from "@/source/features/directions/cadastral";
import { firstSchemaError } from "@/source/features/directions/shared/model/validate";
import { SavedDocumentsField } from "@/source/features/directions/shared/ui/SavedDocumentsField";
import { SavedFileField } from "@/source/features/directions/shared/ui/SavedFileField";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

function validate(profile: CadastralProfile): string | null {
  return firstSchemaError(cadastralProfileSchema, profile);
}

function mergeFiles(current: CadastralProfile, server: CadastralProfile): CadastralProfile {
  return {
    ...current,
    education_diploma: server.education_diploma,
    certificate_file: server.certificate_file,
    documents: server.documents,
  };
}

export function CadastralProfileCard() {
  const { value, setValue, isBusy, applyServerUpdate } = useDirectionProfile({
    title: "Кадастровые работы",
    load: fetchCadastralProfile,
    save: saveCadastralProfile,
    validate,
  });

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;

  return (
    <>
      <CadastralProfileFields value={value} onChange={setValue} />
      <SavedFileField
        label="Диплом об образовании"
        file={value.education_diploma}
        isBusy={isBusy}
        onUpload={(file) => applyServerUpdate(() => uploadCadastralDiploma(file), mergeFiles)}
      />
      <SavedFileField
        label="Квалификационный аттестат"
        file={value.certificate_file}
        isBusy={isBusy}
        onUpload={(file) => applyServerUpdate(() => uploadCadastralCertificate(file), mergeFiles)}
      />
      <SavedDocumentsField
        label="Дипломы, аттестаты, курсы"
        documents={value.documents}
        isBusy={isBusy}
        onUpload={(file) => applyServerUpdate(() => uploadCadastralDocument(file), mergeFiles)}
        onRemove={(url) => applyServerUpdate(() => deleteCadastralDocument(url), mergeFiles)}
      />
    </>
  );
}
