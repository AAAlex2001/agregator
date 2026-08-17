"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/source/shared/ui/Skeleton";
import {
  deleteEcologyDocument,
  EcologyProfileFields,
  emptyEcologyCatalogs,
  fetchEcologyCatalogs,
  fetchEcologyProfile,
  saveEcologyProfile,
  uploadEcologyDocument,
  type EcologyCatalogs,
  type EcologyProfile,
} from "@/source/features/directions/ecology";
import { SavedDocumentsField } from "@/source/features/directions/shared/ui/SavedDocumentsField";
import { uploadDirectionFiles } from "@/source/features/directions/shared/model/files";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

function mergeDocuments(current: EcologyProfile, server: EcologyProfile): EcologyProfile {
  return { ...current, documents: server.documents };
}

export function EcologyProfileCard() {
  const [catalogs, setCatalogs] = useState<EcologyCatalogs>(emptyEcologyCatalogs);
  const { value, setValue, isBusy, applyServerUpdate } = useDirectionProfile({
    title: "Экологическое сопровождение предприятий",
    load: fetchEcologyProfile,
    save: saveEcologyProfile,
  });

  useEffect(() => {
    let alive = true;
    fetchEcologyCatalogs()
      .then((loaded) => alive && setCatalogs(loaded))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;

  return (
    <>
      <EcologyProfileFields value={value} onChange={setValue} catalogs={catalogs} />
      <SavedDocumentsField
        label="Подтверждение квалификационных требований — до 10 документов"
        documents={value.documents}
        isBusy={isBusy}
        onUpload={(files) =>
          applyServerUpdate(
            () => uploadDirectionFiles(files, uploadEcologyDocument),
            mergeDocuments,
          )
        }
        onRemove={(url) => applyServerUpdate(() => deleteEcologyDocument(url), mergeDocuments)}
      />
    </>
  );
}
