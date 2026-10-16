import { uploadFile } from "@/shared/api/upload-file";
import { fromSroProfileResponse } from "../model/profile-values";
import type { SroDirection, SroProfile, SroProfileResponse } from "../model/types";

/** Добавляет дополнительный документ к анкете члена СРО. */
export async function uploadSroDocument(
  direction: SroDirection,
  file: File,
): Promise<SroProfile> {
  const response = await uploadFile(
    `/directions/${direction}/license-holder-profile/documents`,
    file,
    "Не удалось загрузить документ",
  );
  const profile: SroProfileResponse = await response.json();

  return fromSroProfileResponse(profile);
}
