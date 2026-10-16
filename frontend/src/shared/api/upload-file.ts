import { uploadForm } from "./upload-form";

/** Создаёт multipart-форму с одним файлом для отдельной попытки загрузки. */
function createFileBody(files: File[]): FormData {
  const body = new FormData();
  body.append("file", files[0]);

  return body;
}

/** Загружает один файл; повторяет отправку, если браузер потерял исходный файл. */
export function uploadFile(
  path: string,
  file: File,
  errorMessage: string,
): Promise<Response> {
  return uploadForm(path, {
    method: "POST",
    files: [file],
    createBody: createFileBody,
    errorMessage,
  });
}
