import { readResponseError } from "@/shared/api/response-error";
import { API_URL } from "@/shared/config/api";
import type { LoginResponse } from "../model/types";

/** Создаёт заказчика или исполнителя одним multipart-запросом. */
export async function registerAccount(form: FormData): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    credentials: "include",
    body: form,
  }).catch(() => {
    throw new Error("Не удалось связаться с сервером. Проверьте подключение к интернету.");
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response, "Не удалось зарегистрироваться"));
  }

  return response.json();
}

/** Создаёт держателя документов с файлами лицензий и выписок СРО. */
export async function registerLicenseHolder(form: FormData): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/register/license-holder`, {
    method: "POST",
    credentials: "include",
    body: form,
  }).catch(() => {
    throw new Error("Не удалось связаться с сервером. Проверьте подключение к интернету.");
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response, "Не удалось зарегистрироваться"));
  }

  return response.json();
}

