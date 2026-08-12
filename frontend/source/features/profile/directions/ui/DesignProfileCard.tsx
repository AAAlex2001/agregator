"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/source/shared/ui/Skeleton";
import {
  deleteDesignDocument,
  DesignProfileFields,
  emptyDesignCatalogs,
  fetchDesignCatalogs,
  fetchDesignProfile,
  saveDesignProfile,
  uploadDesignDocument,
  type DesignCatalogs,
  type DesignDocumentGroup,
  type DesignProfile,
} from "@/source/features/directions/design";
import { SavedDocumentsField } from "@/source/features/directions/shared/ui/SavedDocumentsField";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

const DOCUMENT_GROUPS: Array<{ group: DesignDocumentGroup; label: string }> = [
  { group: "education", label: "Диплом об образовании — до 5 документов" },
  { group: "nok", label: "Свидетельство НОК" },
  { group: "nrs", label: "Уведомление о включении в НРС" },
  { group: "qualification", label: "Повышение квалификации, курсы — до 5 документов" },
  { group: "rtn", label: "Протокол аттестации РТН" },
];

const GROUP_FIELDS: Record<DesignDocumentGroup, keyof DesignProfile> = {
  education: "education_documents",
  nok: "nok_documents",
  nrs: "nrs_documents",
  qualification: "qualification_documents",
  rtn: "rtn_documents",
};

function mergeDocuments(current: DesignProfile, server: DesignProfile): DesignProfile {
  return {
    ...current,
    education_documents: server.education_documents,
    nok_documents: server.nok_documents,
    nrs_documents: server.nrs_documents,
    qualification_documents: server.qualification_documents,
    rtn_documents: server.rtn_documents,
  };
}

export function DesignProfileCard() {
  const [catalogs, setCatalogs] = useState<DesignCatalogs>(emptyDesignCatalogs);
  const { value, setValue, isBusy, applyServerUpdate } = useDirectionProfile({
    title: "Проектирование промышленных и гражданских объектов",
    load: fetchDesignProfile,
    save: saveDesignProfile,
  });

  useEffect(() => {
    let alive = true;
    fetchDesignCatalogs()
      .then((loaded) => alive && setCatalogs(loaded))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;

  return (
    <>
      <DesignProfileFields value={value} onChange={setValue} catalogs={catalogs} />
      {DOCUMENT_GROUPS.map(({ group, label }) => (
        <SavedDocumentsField
          key={group}
          label={label}
          documents={value[GROUP_FIELDS[group]] as DesignProfile["education_documents"]}
          isBusy={isBusy}
          onUpload={(file) => applyServerUpdate(() => uploadDesignDocument(group, file), mergeDocuments)}
          onRemove={(url) => applyServerUpdate(() => deleteDesignDocument(group, url), mergeDocuments)}
        />
      ))}
    </>
  );
}
