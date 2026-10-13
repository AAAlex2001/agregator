import { DOCUMENT_LABELS, MAX_ORDER_DOCUMENTS, MAX_ORDER_FILES_TOTAL_BYTES, SINGLE_DOCUMENT_CATEGORIES, type SingleDocumentCategory } from "@/source/entities/order";
import type { OrderFormProps } from "../model/types";
import { filesBytes, filesCount } from "../model/useOrderForm";
import { DocumentSlot } from "./DocumentSlot";
import { FormSection } from "./FormSection";
import s from "./FilesSection.module.scss";

const MAX_TOTAL_MB = Math.round(MAX_ORDER_FILES_TOTAL_BYTES / 1024 / 1024);

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

interface FilesSectionProps extends OrderFormProps {
  onAddFile: (category: SingleDocumentCategory, file: File) => void;
  onAddOtherFiles: (files: File[]) => void;
}

/** Документы заказа: ТЗ, договор, карточка предприятия и прочие файлы. */
export function FilesSection({ state, dispatch, onAddFile, onAddOtherFiles }: FilesSectionProps) {
  const hasFreeSlot = filesCount(state) < MAX_ORDER_DOCUMENTS;

  return (
    <FormSection label="Документы заказа">
      {state.workType === "DESIGN" && (
        <span className={s.requirementHint}>
          Обязательно приложите задание на проектирование. Также можно приложить инженерные изыскания, эскизный проект и другие исходные данные.
        </span>
      )}
      <div className={s.row}>
        {SINGLE_DOCUMENT_CATEGORIES.map((category) => (
          <DocumentSlot
            key={category}
            label={DOCUMENT_LABELS[category]}
            existing={state.documents[category]}
            files={state.files[category] ? [state.files[category]] : []}
            multiple={false}
            canAdd={hasFreeSlot || state.documents[category].length > 0 || state.files[category] !== null}
            onAdd={(files) => files[0] && onAddFile(category, files[0])}
            onRemoveExisting={() => dispatch({ type: "removeDocument", category })}
            onRemoveFile={(file) => dispatch({ type: "removeFile", file })}
          />
        ))}
        <DocumentSlot
          label={DOCUMENT_LABELS.other}
          existing={state.documents.other}
          files={state.files.other}
          multiple
          canAdd={hasFreeSlot}
          onAdd={onAddOtherFiles}
          onRemoveExisting={(path) => dispatch({ type: "removeOtherDocument", path })}
          onRemoveFile={(file) => dispatch({ type: "removeFile", file })}
        />
      </div>
      <span className={s.hint}>
        PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX, ZIP, RAR, 7Z. Всего не более {MAX_ORDER_DOCUMENTS} файлов (загружено {filesCount(state)}). Суммарный размер
        новых файлов до {MAX_TOTAL_MB} МБ (сейчас {formatBytes(filesBytes(state))}).
      </span>
    </FormSection>
  );
}
