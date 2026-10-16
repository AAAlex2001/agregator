import { API_URL } from "@/shared/config/api";
import { readResponseError } from "./response-error";

/** Multipart-запрос с файлами и повторной сборкой формы при потере файла браузером. */
interface UploadFormOptions {
  method: "POST" | "PUT" | "PATCH";
  files: File[];
  createBody: (files: File[]) => FormData;
  errorMessage: string;
}

/** Определяет ошибки загрузки, для которых исходный интерфейс повторял отправку. */
function canRetryUpload(error: unknown): boolean {
  return error instanceof TypeError && (
    error.message.includes("ERR_UPLOAD_FILE_CHANGED")
    || error.message.includes("Failed to fetch")
  );
}

/** Читает файлы в память, сохраняя имена, типы и время изменения. */
async function readFilesToMemory(files: File[]): Promise<File[]> {
  const copies: File[] = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();

    copies.push(
      new File([bytes], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      }),
    );
  }

  return copies;
}

/** Отправляет форму с cookie; потерянные файлы перечитывает и отправляет один раз. */
export async function uploadForm(
  path: string,
  options: UploadFormOptions,
): Promise<Response> {
  /** Собирает отдельное тело для каждой попытки отправки. */
  function sendFiles(files: File[]): Promise<Response> {
    return fetch(`${API_URL}${path}`, {
      method: options.method,
      credentials: "include",
      body: options.createBody(files),
    });
  }

  let response: Response;

  try {
    response = await sendFiles(options.files);
  } catch (error) {
    if (!canRetryUpload(error) || options.files.length === 0) {
      throw error;
    }

    const files = await readFilesToMemory(options.files);
    response = await sendFiles(files);
  }

  if (!response.ok) {
    throw new Error(await readResponseError(response, options.errorMessage));
  }

  return response;
}
