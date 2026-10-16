"use client";

import { useNotifications } from "@/shared/ui/notifications";
import {
  MAX_ORDER_DOCUMENTS,
  MAX_ORDER_FILES_TOTAL_BYTES,
} from "../config/files";
import {
  countOrderFormFiles,
  getOrderFormFiles,
  getOrderFormFilesSize,
} from "./order-form-files";
import { useOrderFormContext } from "./order-form-provider";
import type { SingleOrderDocumentCategory } from "./order-request";

/** Размер новых файлов в мегабайтах для сообщения об ограничении. */
const MAX_TOTAL_MB = Math.round(MAX_ORDER_FILES_TOTAL_BYTES / 1024 / 1024);

/** Добавляет и удаляет документы черновика с общими лимитами количества и размера. */
export function useOrderFormFiles() {
  const {
    values,
    dispatch,
    createFilePreview,
    removeFilePreview,
  } = useOrderFormContext();
  const { showError } = useNotifications();

  /** Заменяет единственный документ выбранной категории. */
  function addFile(category: SingleOrderDocumentCategory, file: File) {
    const replacesDocument = values.documents[category].length > 0
      || values.files[category] !== null;

    if (!replacesDocument && countOrderFormFiles(values) >= MAX_ORDER_DOCUMENTS) {
      showError(`Можно прикрепить не более ${MAX_ORDER_DOCUMENTS} файлов`);
      return;
    }

    if (getOrderFormFilesSize(values) + file.size > MAX_ORDER_FILES_TOTAL_BYTES) {
      showError(`Суммарный размер новых файлов не должен превышать ${MAX_TOTAL_MB} МБ`);
      return;
    }

    const selectedFile = createFilePreview(file);
    const previousFile = values.files[category];

    if (previousFile) {
      removeFilePreview(previousFile);
    }

    dispatch({
      type: "file/selected",
      category,
      file: selectedFile,
    });
  }

  /** Прикрепляет дополнительные файлы в пределах оставшихся мест. */
  function addOtherFiles(files: File[]) {
    const availableCount = MAX_ORDER_DOCUMENTS - countOrderFormFiles(values);

    if (files.length > availableCount) {
      showError(`Можно прикрепить не более ${MAX_ORDER_DOCUMENTS} файлов`);
    }

    const acceptedFiles = files.slice(0, availableCount);
    const acceptedSize = acceptedFiles.reduce((total, file) => total + file.size, 0);

    if (getOrderFormFilesSize(values) + acceptedSize > MAX_ORDER_FILES_TOTAL_BYTES) {
      showError(`Суммарный размер новых файлов не должен превышать ${MAX_TOTAL_MB} МБ`);
      return;
    }

    if (acceptedFiles.length > 0) {
      dispatch({
        type: "other-files/added",
        files: acceptedFiles.map(createFilePreview),
      });
    }
  }

  /** Убирает новый файл до отправки заказа. */
  function removeFile(file: File) {
    for (const selected of getOrderFormFiles(values)) {
      if (selected.file === file) {
        removeFilePreview(selected);
      }
    }

    dispatch({
      type: "file/removed",
      file,
    });
  }

  /** Исключает сохранённый документ из одиночной категории. */
  function removeDocument(category: SingleOrderDocumentCategory) {
    dispatch({
      type: "document/removed",
      category,
    });
  }

  /** Исключает дополнительный документ по исходному пути из API. */
  function removeOtherDocument(path: string) {
    dispatch({
      type: "other-document/removed",
      path,
    });
  }

  return {
    addFile,
    addOtherFiles,
    removeFile,
    removeDocument,
    removeOtherDocument,
  };
}
