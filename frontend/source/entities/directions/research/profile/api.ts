import { json, send } from "@/source/shared/api/request";
import type { ResearchProfile } from "./types";

/** Анкета исследователя. */
export async function fetchResearchProfile(): Promise<ResearchProfile> {
  const response = await send("/directions/research/profile", {}, "Не удалось загрузить анкету НИР");
  return response.json();
}

/** Сохранить анкету исследователя. */
export async function saveResearchProfile(profile: ResearchProfile): Promise<ResearchProfile> {
  const response = await send("/directions/research/profile", json("PUT", profile), "Не удалось сохранить анкету НИР");
  return response.json();
}
