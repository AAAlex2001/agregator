"use client";

import { useEffect, useRef, useState } from "react";
import {
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import type { FileGalleryItem } from "@/source/shared/ui/FileGallery";
import base from "./sectionBase.module.scss";
import s from "./BidFilesField.module.scss";

interface Props {
  files: File[];
  onAddFiles: (files: FileList | null) => void;
  onRemoveFile: (index: number) => void;
}

interface PreviewItem {
  file: File;
  url: string;
}

function isImageFile(file: File) {
  return file.type.startsWith("image/") || isImageFileName(file.name);
}

export function BidFilesField({ files, onAddFiles, onRemoveFile }: Props) {
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const nextPreviews = files
      .filter(isImageFile)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));

    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [files]);

  const items: FileGalleryItem[] = files.map((file, index) => {
    const preview = previews.find((item) => item.file === file);
    const previewUrl = preview?.url ?? "";
    const isImage = isImageFile(file);

    return {
      id: `${file.name}-${index}`,
      name: file.name,
      url: previewUrl,
      previewUrl: isImage ? previewUrl : getFileGalleryPreviewUrl(previewUrl, file.name),
      thumbnailUrl: getFileGalleryThumbUrl(previewUrl, file.name),
      isImage,
      onRemove: () => onRemoveFile(index),
    };
  }).filter((item) => item.url);

  return (
    <div className={s.fileField}>
      <FileGallery
        items={items}
        label="Ваши файлы"
        labelClassName={base.fieldLabel}
        hint="Максимум 6 файлов и 100 МБ суммарно"
        hintClassName={base.fieldHint}
        variant="editable"
        onAdd={() => {
          if (!inputRef.current) {
            return;
          }

          inputRef.current.value = "";
          inputRef.current.click();
        }}
        input={(
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx"
            className={base.hiddenInput}
            onChange={(event) => onAddFiles(event.currentTarget.files)}
          />
        )}
      />
    </div>
  );
}