"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/source/shared/ui/Skeleton";
import {
  deleteTechDiagDocument,
  emptyTechDiagCatalogs,
  fetchTechDiagCatalogs,
  fetchTechDiagProfile,
  saveTechDiagProfile,
  TechDiagProfileFields,
  uploadTechDiagDocument,
  type TechDiagCatalogs,
  type TechDiagProfile,
} from "@/source/features/directions/tech-diag";
import { SavedDocumentsField } from "@/source/features/directions/shared/ui/SavedDocumentsField";
import { uploadDirectionFiles } from "@/source/features/directions/shared/model/files";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

function mergeDocuments(current: TechDiagProfile, server: TechDiagProfile): TechDiagProfile {
  return { ...current, documents: server.documents };
}

export function TechDiagProfileCard() {
  const [catalogs, setCatalogs] = useState<TechDiagCatalogs>(emptyTechDiagCatalogs);
  const { value, setValue, isBusy, applyServerUpdate } = useDirectionProfile({
    title: "Техническое освидетельствование и диагностирование",
    load: fetchTechDiagProfile,
    save: saveTechDiagProfile,
  });

  useEffect(() => {
    let alive = true;
    fetchTechDiagCatalogs()
      .then((loaded) => alive && setCatalogs(loaded))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;

  return (
    <>
      <TechDiagProfileFields value={value} onChange={setValue} catalogs={catalogs} />
      <SavedDocumentsField
        label="Квалификационные удостоверения — до 10 документов"
        documents={value.documents}
        isBusy={isBusy}
        onUpload={(files) =>
          applyServerUpdate(
            () => uploadDirectionFiles(files, uploadTechDiagDocument),
            mergeDocuments,
          )
        }
        onRemove={(url) => applyServerUpdate(() => deleteTechDiagDocument(url), mergeDocuments)}
      />
    </>
  );
}
