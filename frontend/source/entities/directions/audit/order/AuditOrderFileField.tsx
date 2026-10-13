"use client";

import { useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { SavedFileField, type DirectionFile } from "../../shared";
import { uploadAuditOrderFile } from "./api";

interface AuditOrderFileFieldProps {
  label: string;
  value: DirectionFile | null;
  onChange: (value: DirectionFile | null) => void;
}

/** Файл к заявке на аудит: грузится на сервер сразу при выборе, в заявке остаётся ссылка. */
export function AuditOrderFileField({ label, value, onChange }: AuditOrderFileFieldProps) {
  const { showError } = useNotifications();
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File) => {
    setIsUploading(true);
    try {
      onChange(await uploadAuditOrderFile(file));
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось загрузить файл");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SavedFileField label={label} file={value} isBusy={isUploading} onUpload={upload} onRemove={() => onChange(null)} />
  );
}
