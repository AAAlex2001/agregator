import { request } from "@/shared/api/request";
import type { PostTemplate } from "../model/types";

/** Свои шаблоны, новые первыми. */
export async function getTemplates(): Promise<PostTemplate[]> {
  const response = await request("/poster/templates", {
    errorMessage: "Не удалось загрузить шаблоны",
  });

  return response.json();
}
