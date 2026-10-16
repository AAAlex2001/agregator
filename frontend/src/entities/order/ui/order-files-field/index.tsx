"use client";

import {
  MAX_ORDER_DOCUMENTS,
  MAX_ORDER_FILES_TOTAL_BYTES,
  ORDER_DOCUMENT_LABELS,
  SINGLE_ORDER_DOCUMENT_CATEGORIES,
} from "../../config/files";
import {
  countOrderFormFiles,
  getOrderFormFilesSize,
} from "../../model/order-form-files";
import { useOrderForm } from "../../model/order-form-provider";
import { useOrderFormFiles } from "../../model/use-order-form-files";
import { OrderDocumentSlot } from "../order-document-slot";
import { OrderFormSection } from "../order-form-section";
import { OrderSingleDocumentField } from "../order-single-document-field";
import styles from "./style.module.scss";

/** Размер новых вложений в мегабайтах для подсказки формы. */
const MAX_TOTAL_MB = Math.round(MAX_ORDER_FILES_TOTAL_BYTES / 1024 / 1024);

/** Показывает текущий размер новых файлов в килобайтах или мегабайтах. */
function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} КБ`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

/** Собирает документы заказа по категориям и показывает общие ограничения. */
export function OrderFilesField() {
  const { values } = useOrderForm();
  const { addOtherFiles, removeOtherDocument, removeFile } = useOrderFormFiles();
  const filesCount = countOrderFormFiles(values);
  const filesSize = getOrderFormFilesSize(values);

  return (
    <OrderFormSection label="Документы заказа">
      {values.workType === "DESIGN" && (
        <span className={styles.requirementHint}>
          Обязательно приложите задание на проектирование. Также можно приложить
          инженерные изыскания, эскизный проект и другие исходные данные.
        </span>
      )}

      <div className={styles.row}>
        {SINGLE_ORDER_DOCUMENT_CATEGORIES.map((category) => (
          <OrderSingleDocumentField
            key={category}
            category={category}
          />
        ))}

        <OrderDocumentSlot
          label={ORDER_DOCUMENT_LABELS.other}
          existing={values.documents.other}
          files={values.files.other}
          multiple
          canAdd={filesCount < MAX_ORDER_DOCUMENTS}
          onAdd={addOtherFiles}
          onRemoveExisting={removeOtherDocument}
          onRemoveFile={removeFile}
        />
      </div>

      <span className={styles.hint}>
        PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX, ZIP, RAR, 7Z.
        Всего не более {MAX_ORDER_DOCUMENTS} файлов (загружено {filesCount}).
        Суммарный размер новых файлов до {MAX_TOTAL_MB} МБ (сейчас {formatBytes(filesSize)}).
      </span>
    </OrderFormSection>
  );
}
