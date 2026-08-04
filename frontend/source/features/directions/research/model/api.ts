import { getJson, putJson } from "../../shared/model/http";
import type { ResearchProfile } from "./types";

export function fetchResearchProfile(): Promise<ResearchProfile> {
  return getJson("/directions/research/profile", "Не удалось загрузить анкету НИР");
}

export function saveResearchProfile(profile: ResearchProfile): Promise<ResearchProfile> {
  return putJson("/directions/research/profile", profile, "Не удалось сохранить анкету НИР");
}
