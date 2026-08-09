"use client";

import { useRef, useState } from "react";
import { TextInput } from "@/source/shared/ui/Inputs";
import { FileGallery, type FileGalleryItem } from "@/source/shared/ui/FileGallery";
import { ChatChevronDownIcon } from "@/source/shared/ui/icons";
import { isImageFileName } from "@/source/shared/lib/filePreview";
import { useObjectUrl } from "@/source/shared/lib/useObjectUrl";
import type { StepProps } from "./types";
import s from "./RegulatoryDocumentsBlock.module.scss";

const ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const HINT = "PDF / JPG / PNG / DOC / DOCX, до 10 МБ";

export function RegulatoryDocumentsBlock({ state, dispatch }: StepProps) {
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
          <div className={s.row}>
            <TextInput
              value={state.miningNumber}
              autoComplete="off"
              onChange={(e) => dispatch({ type: "set", key: "miningNumber", value: e.target.value })}
              placeholder="Лицензия на маркшейдерские работы №"
            />
            <DocFileGallery
              galleryId="mining"
              file={state.files.mining}
              onSelect={(file) => dispatch({ type: "file", key: "mining", file })}
            />
          </div>

          <div className={s.row}>
            <DocFileGallery
              galleryId="sro"
              fileLabel="Выписка из реестра членов СРО в области проектирования"
              file={state.files.sro}
              onSelect={(file) => dispatch({ type: "file", key: "sro", file })}
            />
          </div>

          <div className={s.row}>
            <TextInput
              value={state.labNumber}
              autoComplete="off"
              onChange={(e) => dispatch({ type: "set", key: "labNumber", value: e.target.value })}
              placeholder="Свидетельство об аккредитации лаборатории №"
            />
            <DocFileGallery
              galleryId="lab"
              file={state.files.lab}
              onSelect={(file) => dispatch({ type: "file", key: "lab", file })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface DocFileProps {
  galleryId: string;
  fileLabel?: string;
  file: File | null;
  onSelect: (file: File | null) => void;
}

function DocFileGallery({ galleryId, fileLabel, file, onSelect }: DocFileProps) {
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
            onRemove: () => onSelect(null),
          },
        ]
      : [];

  return (
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
            onSelect(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
      }
    />
  );
}
