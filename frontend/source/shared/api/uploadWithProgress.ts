"use client";

import { extractErrorMessage } from "./errorMessage";

export interface UploadResult<T> {
  ok: boolean;
  status: number;
  body: T | null;
  errorMessage?: string;
}

export async function uploadWithProgress<T>(
  url: string,
  formData: FormData,
  options?: {
    method?: string;
    credentials?: "include" | "same-origin" | "omit";
    onProgress?: (loaded: number, total: number) => void;
  },
): Promise<UploadResult<T>> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options?.method ?? "POST", url, true);
    xhr.withCredentials = (options?.credentials ?? "include") !== "omit";
    if (options?.onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) options.onProgress!(event.loaded, event.total);
      };
    }
    xhr.onload = () => {
      let body: T | null = null;
      try {
        body = xhr.responseText ? (JSON.parse(xhr.responseText) as T) : null;
      } catch {
        body = null;
      }
      const ok = xhr.status >= 200 && xhr.status < 300;
      resolve({
        ok,
        status: xhr.status,
        body,
        errorMessage: ok ? undefined : extractErrorMessage(body) ?? `HTTP ${xhr.status}`,
      });
    };
    xhr.onerror = () => resolve({ ok: false, status: 0, body: null, errorMessage: "Сетевая ошибка" });
    xhr.send(formData);
  });
}
