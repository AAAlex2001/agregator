"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import {
  deleteDesignHolderDocument,
  DesignHolderProfileFields,
  fetchDesignHolderProfile,
  saveDesignHolderProfile,
  uploadDesignHolderDocument,
  type DesignHolderProfile,
} from "@/source/features/directions/design";
import { SavedDocumentsField } from "@/source/features/directions/shared/ui/SavedDocumentsField";
import { uploadDirectionFiles } from "@/source/features/directions/shared/model/files";
import { useDirectionProfile } from "../model/useDirectionProfile";
import s from "./DirectionsSection.module.scss";

function mergeDocuments(current: DesignHolderProfile, server: DesignHolderProfile): DesignHolderProfile {
  return { ...current, documents: server.documents };
}

export function DesignHolderProfileCard() {
  const { value, setValue, isBusy, applyServerUpdate } = useDirectionProfile({
    title: "Проектирование промышленных и гражданских объектов",
    load: fetchDesignHolderProfile,
    save: saveDesignHolderProfile,
  });

  if (value === null) return <Skeleton className={s.skeleton} rounded="md" />;

  return (
    <>
      <DesignHolderProfileFields value={value} onChange={setValue} />
      <SavedDocumentsField
        label="Дополнительные документы — до 10 файлов"
        documents={value.documents}
        isBusy={isBusy}
        onUpload={(files) =>
          applyServerUpdate(
            () => uploadDirectionFiles(files, uploadDesignHolderDocument),
            mergeDocuments,
          )
        }
        onRemove={(url) => applyServerUpdate(() => deleteDesignHolderDocument(url), mergeDocuments)}
      />
    </>
  );
}
