import type { ExpertLocationPayload, UpdateProfilePayload, UserProfile } from "../model/types";
import { json, send, upload } from "@/source/shared/api/request";

/** Профиль текущего пользователя. */
export async function fetchProfile(): Promise<UserProfile> {
  const response = await send("/settings/profile", {}, "Не удалось загрузить профиль");
  return response.json();
}

/** Сохранить имя, фамилию и телефон. */
export async function updateProfile(changes: UpdateProfilePayload): Promise<UserProfile> {
  const response = await send("/settings/profile", json("PUT", changes), "Не удалось сохранить данные");
  return response.json();
}

/** Загрузить новое фото профиля. */
export async function uploadAvatar(file: File): Promise<UserProfile> {
  const response = await upload("/settings/avatar", file, "Не удалось загрузить фото");
  return response.json();
}

/** Сменить пароль. */
export async function changePassword(password: string, passwordConfirm: string): Promise<void> {
  await send(
    "/settings/password",
    json("POST", { new_password: password, new_password_confirm: passwordConfirm }),
    "Не удалось сменить пароль",
  );
}

/** Отправить код подтверждения на новую почту. Почта меняется только после ввода кода. */
export async function requestEmailChange(email: string): Promise<void> {
  await send("/settings/email/request-change", json("POST", { new_email: email }), "Не удалось отправить код");
}

/** Подтвердить новую почту кодом из письма. */
export async function confirmEmailChange(code: string): Promise<UserProfile> {
  const response = await send("/settings/email/confirm-change", json("POST", { code }), "Не удалось подтвердить код");
  return response.json();
}

/** Сохранить направления, отмеченные без анкеты. */
export async function updateDirections(directions: string[]): Promise<UserProfile> {
  const response = await send("/settings/directions", json("PUT", { directions }), "Не удалось сохранить направления");
  return response.json();
}

/** Сохранить местоположение исполнителя и видимость на карте. */
export async function updateExpertLocation(location: ExpertLocationPayload): Promise<UserProfile> {
  const response = await send("/settings/expert-location", json("PUT", location), "Не удалось сохранить локацию");
  return response.json();
}
