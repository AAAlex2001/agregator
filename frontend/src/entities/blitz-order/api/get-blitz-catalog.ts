import { request } from "@/shared/api/request";
import type { BlitzCatalog } from "../model/types";

/** Области аттестации, объекты экспертизы, виды договора и сроки. */
export async function getBlitzCatalog(): Promise<BlitzCatalog> {
  const response = await request("/blitz/catalog", {
    errorMessage: "Не удалось загрузить справочник",
  });

  return response.json();
}
