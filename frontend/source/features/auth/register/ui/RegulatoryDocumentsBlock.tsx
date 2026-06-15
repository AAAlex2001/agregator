"use client";

import { useRef, useState } from "react";
import { TextInput } from "@/source/shared/ui/Inputs";
import { FileGallery, type FileGalleryItem } from "@/source/shared/ui/FileGallery";
import { ChatChevronDownIcon } from "@/source/shared/ui/icons";
import { isImageFileName } from "@/source/shared/lib/filePreview";
import { useObjectUrl } from "@/source/shared/lib/useObjectUrl";
import s from "./RegulatoryDocumentsBlock.module.scss";

const ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const HINT = "PDF / JPG / PNG / DOC / DOCX, до 10 МБ";

interface Props {
  miningLicenseFile: File | null;
  sroDesignFile: File | null;
  labAccreditationFile: File | null;
  miningLicenseNumber: string;
  labAccreditationNumber: string;
  onMiningNumberChange: (v: string) => void;
  onLabNumberChange: (v: string) => void;
  onMiningFileSelect?: (f: File | null) => void;
  onSroFileSelect?: (f: File | null) => void;
  onLabFileSelect?: (f: File | null) => void;
}

export function RegulatoryDocumentsBlock(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.wrap}>
      <button
        type="button"
        className={s.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={s.toggleText}>Дополнительные разрешительные документы</span>
        <ChatChevronDownIcon className={`${s.chevron} ${open ? s.chevronOpen : ""}`.trim()} />
      </button>

      {open && (
        <div className={s.body}>
          <DocRow
            placeholder="Лицензия на маркшейдерские работы №"
            number={props.miningLicenseNumber}
            file={props.miningLicenseFile}
            onNumberChange={props.onMiningNumberChange}
            onFileSelect={props.onMiningFileSelect}
            galleryId="mining"
          />
          <DocRow
            fileLabel="Выписка из реестра членов СРО в области проектирования"
            file={props.sroDesignFile}
            onFileSelect={props.onSroFileSelect}
            galleryId="sro"
          />
          <DocRow
            placeholder="Свидетельство об аккредитации лаборатории №"
            number={props.labAccreditationNumber}
            file={props.labAccreditationFile}
            onNumberChange={props.onLabNumberChange}
            onFileSelect={props.onLabFileSelect}
            galleryId="lab"
          />
        </div>
      )}
    </div>
  );
}

interface RowProps {
  placeholder?: string;
  number?: string;
  fileLabel?: string;
  file: File | null;
  onNumberChange?: (v: string) => void;
  onFileSelect?: (f: File | null) => void;
  galleryId: string;
}

function DocRow({ placeholder, number, fileLabel, file, onNumberChange, onFileSelect, galleryId }: RowProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const blobUrl = useObjectUrl(file);

  const items: FileGalleryItem[] =
    file && blobUrl
      ? [
          {
            id: `${galleryId}-local`,
            name: file.name,
            url: blobUrl,
            previewUrl: blobUrl,
            thumbnailUrl: blobUrl,
            isImage: isImageFileName(file.name),
            onRemove: onFileSelect ? () => onFileSelect(null) : undefined,
          },
        ]
      : [];

  return (
    <div className={s.row}>
      {placeholder && (
        <TextInput
          value={number ?? ""}
          autoComplete="off"
          onChange={(e) => onNumberChange?.(e.target.value)}
          placeholder={placeholder}
        />
      )}
      <FileGallery
        label={fileLabel ?? "Файл документа"}
        hint={HINT}
        items={items}
        variant="editable"
        onAdd={() => inputRef.current?.click()}
        input={
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            hidden
            onChange={(e) => {
              const next = e.target.files?.[0] ?? null;
              e.target.value = "";
              if (onFileSelect) onFileSelect(next);
            }}
          />
        }
      />
    </div>
  );
}
