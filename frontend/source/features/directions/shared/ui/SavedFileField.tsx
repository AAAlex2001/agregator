"use client";

import { useRef } from "react";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import {
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { FILE_ACCEPT, FILE_HINT, type DirectionFile } from "../model/files";

interface Props {
  label: string;
  file: DirectionFile | null;
  isBusy: boolean;
  onUpload: (file: File) => void;
}

export function SavedFileField({ label, file, isBusy, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const items = file
    ? [
        {
          id: file.url,
          name: file.name,
          url: resolveFileUrl(file.url),
          previewUrl: isImageFileName(file.name)
            ? resolveFileUrl(file.url)
            : getFileGalleryPreviewUrl(resolveFileUrl(file.url), file.name),
          thumbnailUrl: getFileGalleryThumbUrl(resolveFileUrl(file.url), file.name),
          isImage: isImageFileName(file.name),
        },
      ]
    : [];

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint={`${FILE_HINT}; новый файл заменит прежний`}
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
            const picked = event.target.files?.[0];
            event.target.value = "";
            if (picked) onUpload(picked);
          }}
        />
      }
    />
  );
}
