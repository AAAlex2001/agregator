import { API_URL } from "@/shared/config/api";

/** Берёт исходное имя из фрагмента URL или последнее имя в пути файла. */
export function getFileDisplayName(path: string, fallback = "Файл"): string {
  const fragmentMatch = path.match(/#name=(.+)$/);

  if (fragmentMatch) {
    return decodeURIComponent(fragmentMatch[1]);
  }

  return path.split("/").pop() ?? fallback;
}

/** Находит адрес сервера, который отдаёт загруженные файлы. */
function getFileOrigin(): string | null {
  if (/^https?:\/\//i.test(API_URL)) {
    return new URL(API_URL).origin;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:8000";
  }

  return window.location.origin;
}

/** Превращает путь загруженного файла в URL; готовые и локальные URL сохраняет. */
export function resolveFileUrl(value: string): string {
  if (!value || /^(blob:|data:|https?:\/\/)/i.test(value)) {
    return value;
  }

  const origin = getFileOrigin();

  if (!origin) {
    return value;
  }

  return value.startsWith("/") ? `${origin}${value}` : `${origin}/${value}`;
}
