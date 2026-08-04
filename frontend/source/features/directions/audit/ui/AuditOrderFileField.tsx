"use client";

import { useRef, useState } from "react";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import {
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { FILE_ACCEPT, FILE_HINT, type DirectionFile } from "../../shared/model/files";
import { uploadAuditOrderFile } from "../model/api";

interface Props {
  label: string;
  value: DirectionFile | null;
  onChange: (value: DirectionFile | null) => void;
}

export function AuditOrderFileField({ label, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isBusy, setIsBusy] = useState(false);
  const { showError } = useNotifications();

  const upload = async (file: File) => {
    setIsBusy(true);
    try {
      onChange(await uploadAuditOrderFile(file));
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось загрузить файл");
    } finally {
      setIsBusy(false);
    }
  };

  const items = value
    ? [
        {
          id: value.url,
          name: value.name,
          url: resolveFileUrl(value.url),
          previewUrl: isImageFileName(value.name)
            ? resolveFileUrl(value.url)
            : getFileGalleryPreviewUrl(resolveFileUrl(value.url), value.name),
          thumbnailUrl: getFileGalleryThumbUrl(resolveFileUrl(value.url), value.name),
          isImage: isImageFileName(value.name),
          onRemove: isBusy ? undefined : () => onChange(null),
        },
      ]
    : [];

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint={FILE_HINT}
      items={items}
      onAdd={() => inputRef.current?.click()}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={FILE_ACCEPT}
          disabled={isBusy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void upload(file);
          }}
        />
      }
    />
  );
}
