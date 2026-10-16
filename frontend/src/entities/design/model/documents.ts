import {
  DESIGN_DOCUMENT_ACCEPT,
  DESIGN_DOCUMENT_LIMIT,
  DESIGN_DOCUMENT_MAX_SIZE,
} from "../config/documents";
import type { DesignDocumentGroup, DesignProfileDocuments } from "./types";

/** Проверяет размер и расширение документа перед отправкой на сервер. */
export function validateDesignDocument(file: File): string | null {
  if (file.size === 0) {
    return "Выберите файл, который содержит данные.";
  }

  if (file.size > DESIGN_DOCUMENT_MAX_SIZE) {
    return "Размер документа не должен превышать 10 МБ.";
  }

  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

  if (!DESIGN_DOCUMENT_ACCEPT.split(",").includes(extension)) {
    return "Выберите документ в формате PDF, JPG, PNG, DOC или DOCX.";
  }

  return null;
}

/** Возвращает документы одной группы анкеты. */
function getDesignDocuments(
  documents: DesignProfileDocuments,
  group: DesignDocumentGroup,
) {
  switch (group) {
    case "education":
      return documents.education_documents;
    case "nok":
      return documents.nok_documents;
    case "nrs":
      return documents.nrs_documents;
    case "qualification":
      return documents.qualification_documents;
    case "rtn":
      return documents.rtn_documents;
  }
}

/** Проверяет ограничение группы и сами файлы перед загрузкой. */
export function validateDesignUpload(
  documents: DesignProfileDocuments,
  group: DesignDocumentGroup,
  files: File[],
): string | null {
  const total = getDesignDocuments(documents, group).length + files.length;

  if (total > DESIGN_DOCUMENT_LIMIT) {
    return "В одной группе можно сохранить не больше пяти документов.";
  }

  const errors = files.map(validateDesignDocument);

  return errors.find((error) => error !== null) ?? null;
}
