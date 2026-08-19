"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/source/shared/ui/Skeleton";
import {
  deleteSurveyDocument,
  SurveyProfileFields,
  emptySurveyCatalogs,
  fetchSurveyCatalogs,
  fetchSurveyProfile,
  saveSurveyProfile,
  uploadSurveyDocument,
  type SurveyCatalogs,
  type SurveyDocumentGroup,
  type SurveyProfile,
} from "@/source/features/directions/survey";
import { SavedDocumentsField } from "@/source/features/directions/shared/ui/SavedDocumentsField";
import { uploadDirectionFiles } from "@/source/features/directions/shared/model/files";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

const DOCUMENT_GROUPS: Array<{ group: SurveyDocumentGroup; label: string }> = [
  { group: "education", label: "Диплом об образовании — до 5 документов" },
  { group: "nok", label: "Свидетельства НОК — до 5 документов" },
  { group: "nrs", label: "Уведомления о включении в НРС — до 5 документов" },
  { group: "qualification", label: "Повышение квалификации, курсы — до 5 документов" },
  { group: "rtn", label: "Протоколы аттестации РТН — до 5 документов" },
];

const GROUP_FIELDS: Record<SurveyDocumentGroup, keyof SurveyProfile> = {
  education: "education_documents",
  nok: "nok_documents",
  nrs: "nrs_documents",
  qualification: "qualification_documents",
  rtn: "rtn_documents",
};

function mergeDocuments(current: SurveyProfile, server: SurveyProfile): SurveyProfile {
  return {
    ...current,
    education_documents: server.education_documents,
    nok_documents: server.nok_documents,
    nrs_documents: server.nrs_documents,
    qualification_documents: server.qualification_documents,
    rtn_documents: server.rtn_documents,
  };
}

export function SurveyProfileCard() {
  const [catalogs, setCatalogs] = useState<SurveyCatalogs>(emptySurveyCatalogs);
  const { value, setValue, isBusy, applyServerUpdate } = useDirectionProfile({
    title: "Инженерные изыскания",
    load: fetchSurveyProfile,
    save: saveSurveyProfile,
  });

  useEffect(() => {
    let alive = true;
    fetchSurveyCatalogs()
      .then((loaded) => alive && setCatalogs(loaded))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;

  return (
    <>
      <SurveyProfileFields value={value} onChange={setValue} catalogs={catalogs} />
      {DOCUMENT_GROUPS.map(({ group, label }) => (
        <SavedDocumentsField
          key={group}
          label={label}
          documents={value[GROUP_FIELDS[group]] as SurveyProfile["education_documents"]}
          isBusy={isBusy}
          maxFiles={5}
          onUpload={(files) =>
            applyServerUpdate(
              () => uploadDirectionFiles(files, (file) => uploadSurveyDocument(group, file)),
              mergeDocuments,
            )
          }
          onRemove={(url) => applyServerUpdate(() => deleteSurveyDocument(group, url), mergeDocuments)}
        />
      ))}
    </>
  );
}
