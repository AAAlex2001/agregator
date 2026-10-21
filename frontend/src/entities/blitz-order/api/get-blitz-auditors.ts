import { request } from "@/shared/api/request";
import type { BlitzTeamMember } from "../model/audit-types";

/** Аудиторы, из которых руководитель набирает группу. */
export async function getBlitzAuditors(): Promise<BlitzTeamMember[]> {
  const response = await request("/blitz/audit/auditors", {
    errorMessage: "Не удалось загрузить аудиторов",
  });

  return response.json();
}