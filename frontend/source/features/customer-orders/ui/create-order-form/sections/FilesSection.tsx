"use client";

import { useEffect, useRef, useState } from "react";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import {
  getFileDisplayName,
  getFileExtension,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { FileIcon } from "@/source/shared/ui/icons";
import {
  DOCUMENT_LABELS,
  MAX_ORDER_DOCUMENTS,
  SINGLE_DOCUMENT_CATEGORIES,
} from "@/source/entities/order";
import {
  canAddMoreOther,
  freeSlots,
  singleSlotIsFilled,
  totalDocumentsCount,
  type DocumentsFormState,
  type OtherFilesSlot,
  type SingleFileSlot,
} from "../../../model/formFiles";
import base from "./sectionBase.module.scss";
import s from "./filesSection.module.scss";

const ACCEPT_ATTR = ".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx";

interface Props {
  documents: DocumentsFormState;
  onSetSingle: (category: "technical" | "contract" | "company", file: File | null) => void;
  onRemoveSingleExisting: (category: "technical" | "contract" | "company") => void;
  onAddOther: (files: File[]) => void;
  onRemoveOtherNew: (index: number) => void;
  onRemoveOtherExisting: (index: number) => void;
}

export function FilesSection({
  documents,
  onSetSingle,
  onRemoveSingleExisting,
  onAddOther,
  onRemoveOtherNew,
  onRemoveOtherExisting,
}: Props) {
  const canAddSingle = freeSlots(documents) > 0;

  return (
    <section className={base.section}>
      <span className={base.label}>Документы заказа</span>
      <div className={s.row}>
        {SINGLE_DOCUMENT_CATEGORIES.map((category) => (
          <SingleSlotField
            key={category}
            label={DOCUMENT_LABELS[category]}
            slot={documents[category]}
            canAdd={canAddSingle}
            onSelect={(file) => onSetSingle(category, file)}
            onRemoveNew={() => onSetSingle(category, null)}
            onRemoveExisting={() => onRemoveSingleExisting(category)}
          />
        ))}
        <OtherSlotField
          slot={documents.other}
          canAddMore={canAddMoreOther(documents)}
          onAdd={onAddOther}
          onRemoveNew={onRemoveOtherNew}
          onRemoveExisting={onRemoveOtherExisting}
        />
      </div>
      <span className={s.hint}>
        PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX. Всего не более {MAX_ORDER_DOCUMENTS} файлов
        (загружено {totalDocumentsCount(documents)}).
      </span>
    </section>
  );
}

interface SingleSlotProps {
  label: string;
  slot: SingleFileSlot;
  canAdd: boolean;
  onSelect: (file: File) => void;
  onRemoveNew: () => void;
  onRemoveExisting: () => void;
}

function SingleSlotField({ label, slot, canAdd, onSelect, onRemoveNew, onRemoveExisting }: SingleSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const filled = singleSlotIsFilled(slot);

  const onPick = () => inputRef.current?.click();
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onSelect(file);
    event.target.value = "";
  };

  return (
    <div className={s.column}>
      <div className={s.tilesRow}>
        {filled ? (
          slot.newFile ? (
            <NewFileTile file={slot.newFile} onRemove={onRemoveNew} />
          ) : (
            <ExistingFileTile path={slot.existing!} onRemove={onRemoveExisting} />
          )
        ) : canAdd ? (
          <AddTile onClick={onPick} />
        ) : (
          <DisabledTile />
        )}
      </div>
      <span className={s.caption}>{label}</span>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className={s.fileInput}
        onChange={onChange}
      />
    </div>
  );
}

function DisabledTile() {
  return (
    <div className={`${s.tile} ${s.tileDisabled}`} aria-hidden="true">
      <span className={s.dash}>—</span>
    </div>
  );
}

interface OtherSlotProps {
  slot: OtherFilesSlot;
  canAddMore: boolean;
  onAdd: (files: File[]) => void;
  onRemoveNew: (index: number) => void;
  onRemoveExisting: (index: number) => void;
}

function OtherSlotField({ slot, canAddMore, onAdd, onRemoveNew, onRemoveExisting }: OtherSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onPick = () => inputRef.current?.click();
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const list = event.target.files;
    if (list && list.length > 0) onAdd(Array.from(list));
    event.target.value = "";
  };

  return (
    <div className={s.column}>
      <div className={s.tilesRow}>
        {slot.existing.map((path, index) => (
          <ExistingFileTile
            key={`existing-${path}-${index}`}
            path={path}
            onRemove={() => onRemoveExisting(index)}
          />
        ))}
        {slot.newFiles.map((file, index) => (
          <NewFileTile
            key={`new-${file.name}-${index}`}
            file={file}
            onRemove={() => onRemoveNew(index)}
          />
        ))}
        {canAddMore ? <AddTile onClick={onPick} /> : null}
      </div>
      <span className={s.caption}>{DOCUMENT_LABELS.other}</span>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTR}
        className={s.fileInput}
        onChange={onChange}
      />
    </div>
  );
}

function AddTile({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className={`${s.tile} ${s.tileAdd}`} onClick={onClick} aria-label="Добавить файл">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 5V19M5 12H19" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function NewFileTile({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isImage = isImageFileName(file.name);

  useEffect(() => {
    if (!isImage) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  return (
    <FileTile
      name={file.name}
      previewUrl={previewUrl}
      isImage={isImage}
      onRemove={onRemove}
    />
  );
}

function ExistingFileTile({ path, onRemove }: { path: string; onRemove: () => void }) {
  const name = getFileDisplayName(path);
  const isImage = isImageFileName(name);
  return (
    <FileTile
      name={name}
      previewUrl={isImage ? resolveFileUrl(path) : null}
      isImage={isImage}
      onRemove={onRemove}
    />
  );
}

interface FileTileProps {
  name: string;
  previewUrl: string | null;
  isImage: boolean;
  onRemove: () => void;
}

function FileTile({ name, previewUrl, isImage, onRemove }: FileTileProps) {
  return (
    <div className={s.tileWrap}>
      <div className={`${s.tile} ${isImage ? s.tileImage : ""}`.trim()} title={name}>
        {isImage && previewUrl ? (
          <img src={previewUrl} alt={name} className={s.image} />
        ) : (
          <span className={s.fileMeta}>
            <FileIcon className={s.fileIcon} />
            <span className={s.fileExtension}>{getFileExtension(name)}</span>
          </span>
        )}
      </div>
      <button
        type="button"
        className={s.removeButton}
        onClick={onRemove}
        aria-label={`Удалить файл ${name}`}
      >
        ×
      </button>
    </div>
  );
}
