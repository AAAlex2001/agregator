"use client";

import { MAX_ORDER_DOCUMENTS, ORDER_DOCUMENT_LABELS } from "../../config/files";
import { countOrderFormFiles } from "../../model/order-form-files";
import { useOrderForm } from "../../model/order-form-provider";
import type { SingleOrderDocumentCategory } from "../../model/order-request";
import { useOrderFormFiles } from "../../model/use-order-form-files";
import { OrderDocumentSlot } from "../order-document-slot";

/** Категория с единственным документом: задание, договор или карточка предприятия. */
interface OrderSingleDocumentFieldProps {
  category: SingleOrderDocumentCategory;
}

/** Связывает выбор и замену одного документа с черновиком заказа. */
export function OrderSingleDocumentField({
  category,
}: OrderSingleDocumentFieldProps) {
  const { values } = useOrderForm();
  const { addFile, removeFile, removeDocument } = useOrderFormFiles();
  const selectedFile = values.files[category];
  const existing = values.documents[category];
  const canAdd = countOrderFormFiles(values) < MAX_ORDER_DOCUMENTS
    || existing.length > 0
    || selectedFile !== null;

  /** Принимает первый файл из одиночного выбора. */
  function selectFile(files: File[]) {
    const file = files[0];

    if (file) {
      addFile(category, file);
    }
  }

  /** Исключает сохранённый документ выбранной категории. */
  function removeExistingDocument() {
    removeDocument(category);
  }

  return (
    <OrderDocumentSlot
      label={ORDER_DOCUMENT_LABELS[category]}
      existing={existing}
      files={selectedFile ? [selectedFile] : []}
      multiple={false}
      canAdd={canAdd}
      onAdd={selectFile}
      onRemoveExisting={removeExistingDocument}
      onRemoveFile={removeFile}
    />
  );
}
