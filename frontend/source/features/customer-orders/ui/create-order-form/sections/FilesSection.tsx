"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { DropzoneOptions } from "react-dropzone";
import {
  getFileDisplayName,
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import type { FileGalleryItem } from "@/source/shared/ui/FileGallery";
import base from "./sectionBase.module.scss";
import s from "./filesSection.module.scss";

interface Props {
  existingFiles: string[];
  files: File[];
  dropzoneOptions: DropzoneOptions;
  onRemoveFile: (index: number) => void;
  onRemoveExistingFile: (index: number) => void;
}

interface NewFilePreview {
  file: File;
  url: string;
}

function isImageName(name: string) {
  return isImageFileName(name);
}

export function FilesSection({
  existingFiles,
  files,
  dropzoneOptions,
  onRemoveFile,
  onRemoveExistingFile,
}: Props) {
  const [previews, setPreviews] = useState<NewFilePreview[]>([]);
  const dropzone = useDropzone({
    ...dropzoneOptions,
    noClick: true,
  });

  useEffect(() => {
    const nextPreviews = files.map((file) => ({ file, url: URL.createObjectURL(file) }));

    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [files]);

  const items: FileGalleryItem[] = [
    ...existingFiles.map((file, index) => {
      const fileUrl = resolveFileUrl(file);
      const name = getFileDisplayName(file);
      const isImage = isImageName(name);

      return {
        id: `existing-${file}-${index}`,
        name,
        url: fileUrl,
        previewUrl: isImage ? fileUrl : getFileGalleryPreviewUrl(fileUrl, name),
        thumbnailUrl: getFileGalleryThumbUrl(fileUrl, name),
        isImage,
        onRemove: () => onRemoveExistingFile(index),
      };
    }),
    ...files.map((file, index) => {
      const preview = previews.find((item) => item.file === file);
      const previewUrl = preview?.url ?? "";
      const isImage = isImageName(file.name);

      return {
        id: `local-${file.name}-${index}`,
        name: file.name,
        url: previewUrl,
        previewUrl: isImage ? previewUrl : getFileGalleryPreviewUrl(previewUrl, file.name),
        thumbnailUrl: getFileGalleryThumbUrl(previewUrl, file.name),
        isImage,
        onRemove: () => onRemoveFile(index),
      };
    }),
  ].filter((item) => item.url);

  const gridProps = dropzone.getRootProps({
    className: dropzone.isDragActive ? s.gridActive : undefined,
  });

  return (
    <section className={base.section}>
      <FileGallery
        items={items}
        label="Файлы"
        labelClassName={base.label}
        hint="PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX"
        hintClassName={s.hint}
        variant="editable"
        onAdd={() => dropzone.open()}
        input={<input {...dropzone.getInputProps()} />}
        gridProps={gridProps}
      />
    </section>
  );
}