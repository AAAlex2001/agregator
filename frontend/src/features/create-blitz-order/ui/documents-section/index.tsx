"use client";

import { BlitzFilePicker } from "@/entities/blitz-order";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { FormSection } from "@/shared/ui/form-section";

/** Выбранные файлы документации и как добавить ещё. */
interface DocumentsSectionProps {
  items: FileGalleryItem[];
  isFull: boolean;
  onAdd: (files: FileList | null) => void;
}

/** Кто что видит в заявке. */
const DOCUMENTS_HINT = "Эксперты видят документацию до того, как взять заявку. "
  + "Реквизиты — только тот, кто взял";

/** Документация на экспертизу. */
export function DocumentsSection({ items, isFull, onAdd }: DocumentsSectionProps) {
  return (
    <FormSection
      title="Документация"
      hint={DOCUMENTS_HINT}
    >
      <BlitzFilePicker
        label="Файлы документации"
        items={items}
        isFull={isFull}
        onAdd={onAdd}
      />
    </FormSection>
  );
}