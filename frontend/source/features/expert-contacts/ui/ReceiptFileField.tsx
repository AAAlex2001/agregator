"use client";

import { useEffect, useRef, useState } from "react";
import { FileGallery, type FileGalleryItem } from "@/source/shared/ui/FileGallery";
import { isImageFileName } from "@/source/shared/lib/filePreview";
import s from "./ReceiptFileField.module.scss";

const ACCEPTED_RECEIPT_TYPES = "application/pdf,image/jpeg,image/png,image/webp";

interface ReceiptFileFieldProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export function ReceiptFileField({ file, onChange }: ReceiptFileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const items: FileGalleryItem[] = file && previewUrl
    ? [{
        id: `${file.name}-${file.lastModified}`,
        name: file.name,
        url: previewUrl,
        isImage: isImageFileName(file.name),
        onRemove: () => onChange(null),
      }]
    : [];

  return (
    <FileGallery
      items={items}
      label="Чек об оплате"
      hint="PDF, JPG, PNG или WEBP, не более 8 МБ"
      variant="editable"
      onAdd={() => inputRef.current?.click()}
      blockClassName={s.receiptField}
      input={(
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_RECEIPT_TYPES}
          className={s.hiddenFileInput}
          onChange={(event) => {
            onChange(event.target.files?.[0] ?? null);
            event.target.value = "";
          }}
        />
      )}
    />
  );
}
