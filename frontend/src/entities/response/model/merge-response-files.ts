import {
  MAX_RESPONSE_FILES,
  MAX_RESPONSE_FILES_SIZE,
} from "../config/files";

/** Проверенные вложения либо прежний список с причиной отказа. */
interface ResponseFilesResult {
  files: File[];
  error: string | null;
}

/** Сопоставляет повторно выбранные файлы по имени, размеру и времени изменения. */
function fileSignature(file: File): string {
  return [file.name, file.size, file.type, file.lastModified].join("::");
}

/** Добавляет уникальные вложения, сохраняя прежние при превышении лимитов. */
export function mergeResponseFiles(
  current: File[],
  added: File[],
): ResponseFilesResult {
  const files = [...current];
  const signatures = new Set(current.map(fileSignature));

  for (const file of added) {
    const signature = fileSignature(file);

    if (!signatures.has(signature)) {
      files.push(file);
      signatures.add(signature);
    }
  }

  if (files.length > MAX_RESPONSE_FILES) {
    return {
      files: current,
      error: "Можно прикрепить не более 6 файлов",
    };
  }

  const totalSize = files.reduce((size, file) => size + file.size, 0);

  if (totalSize > MAX_RESPONSE_FILES_SIZE) {
    return {
      files: current,
      error: "Суммарный размер файлов не должен превышать 100 МБ",
    };
  }

  return { files, error: null };
}
