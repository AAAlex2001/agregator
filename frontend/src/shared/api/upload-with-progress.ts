import { API_URL } from "@/shared/config/api";
import { readResponseError } from "./response-error";

/** Тело multipart-запроса, текст ошибки и получатель процента отправки. */
interface UploadWithProgressOptions {
  body: FormData;
  errorMessage: string;
  onProgress: (percent: number) => void;
}

/** Отправляет форму с cookie через XHR, чтобы сообщать процент загрузки файлов. */
export async function uploadWithProgress(
  path: string,
  options: UploadWithProgressOptions,
): Promise<Response> {
  const response = await new Promise<Response>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${API_URL}${path}`);
    xhr.withCredentials = true;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        options.onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      resolve(new Response(xhr.responseText, { status: xhr.status }));
    };
    xhr.onerror = () => {
      reject(new Error("Не удалось связаться с сервером. Проверьте подключение к интернету."));
    };
    xhr.send(options.body);
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response, options.errorMessage));
  }

  return response;
}
