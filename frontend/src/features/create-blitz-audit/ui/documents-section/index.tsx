"use client";

import {
  BLITZ_AUDIT_ACCEPT,
  BLITZ_AUDIT_FILES_HINT,
  BlitzChecklistPicker,
  BlitzFilePicker,
} from "@/entities/blitz-order";
import type { BlitzChecklistFile, BlitzChecklistItem } from "@/entities/blitz-order";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { FormSection } from "@/shared/ui/form-section";

/** Отдельный файл заявки: превью, заполнен ли и как добавить. */
interface SingleFile {
  items: FileGalleryItem[];
  isFull: boolean;
  addFiles: (files: FileList | null) => void;
}

/** Документы по перечню и отдельные файлы, которые нужны этой заявке. */
interface DocumentsSectionProps {
  checklist: BlitzChecklistItem[];
  entries: BlitzChecklistFile[];
  needsOpoCertificate: boolean;
  needsPowerOfAttorney: boolean;
  needsSto: boolean;
  opoCertificate: SingleFile;
  powerOfAttorney: SingleFile;
  stoFile: SingleFile;
  onChecklistAdd: (item: number, files: FileList | null) => void;
  onChecklistRemove: (entry: BlitzChecklistFile) => void;
}

/** Что прочитать о документах. */
const DOCUMENTS_HINT = "Документы можно приложить сейчас или после согласования Плана аудита. "
  + "Аудитор принимает PDF, подписанные PDF, фото и видео — Word и Excel не подойдут";

/** Документы по перечню, свидетельство ОПО, доверенность и СТО. */
export function DocumentsSection({
  checklist,
  entries,
  needsOpoCertificate,
  needsPowerOfAttorney,
  needsSto,
  opoCertificate,
  powerOfAttorney,
  stoFile,
  onChecklistAdd,
  onChecklistRemove,
}: DocumentsSectionProps) {
  const singles = [
    {
      key: "opo",
      label: "Свидетельство о регистрации ОПО",
      file: opoCertificate,
      isShown: needsOpoCertificate,
    },
    { key: "proxy", label: "Доверенность", file: powerOfAttorney, isShown: needsPowerOfAttorney },
    { key: "sto", label: "Файл СТО", file: stoFile, isShown: needsSto },
  ];

  return (
    <FormSection
      title="Документы"
      hint={DOCUMENTS_HINT}
    >
      {singles.filter((single) => single.isShown).map((single) => (
        <BlitzFilePicker
          key={single.key}
          label={single.label}
          hint={BLITZ_AUDIT_FILES_HINT}
          accept={BLITZ_AUDIT_ACCEPT}
          items={single.file.items}
          isFull={single.file.isFull}
          multiple={false}
          onAdd={single.file.addFiles}
        />
      ))}
      <BlitzChecklistPicker
        items={checklist}
        entries={entries}
        provided={[]}
        onAdd={onChecklistAdd}
        onRemove={onChecklistRemove}
      />
    </FormSection>
  );
}