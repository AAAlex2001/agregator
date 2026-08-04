"use client";

import { useRef } from "react";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import { isImageFileName } from "@/source/shared/lib/filePreview";
import { useObjectUrls } from "@/source/shared/lib/useObjectUrls";
import { FILE_ACCEPT, FILE_HINT, MAX_PROFILE_DOCUMENTS } from "../model/files";

interface Props {
  label: string;
  files: File[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export function LocalFilesPicker({ label, files, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const urls = useObjectUrls(files);

  const items =
    urls.length === files.length
      ? files.map((file, index) => ({
          id: `${file.name}-${index}`,
          name: file.name,
          url: urls[index],
          previewUrl: urls[index],
          thumbnailUrl: urls[index],
          isImage: isImageFileName(file.name),
          onRemove: () => onRemove(index),
        }))
      : [];

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint={`${FILE_HINT}, не более ${MAX_PROFILE_DOCUMENTS} файлов`}
      items={items}
      onAdd={files.length < MAX_PROFILE_DOCUMENTS ? () => inputRef.current?.click() : undefined}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={FILE_ACCEPT}
          onChange={(event) => {
            const picked = Array.from(event.target.files ?? []);
            event.target.value = "";
            if (picked.length) onAdd(picked.slice(0, MAX_PROFILE_DOCUMENTS - files.length));
          }}
        />
      }
    />
  );
}
