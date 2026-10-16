import { request } from "@/shared/api/request";
import type { DesignProfile, DesignProfileValues } from "../model/types";

/** Сохраняет поля анкеты; документы загружаются и удаляются отдельно. */
export async function updateDesignProfile(
  values: DesignProfileValues,
): Promise<DesignProfile> {
  const response = await request("/directions/design/expert-profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      education: values.education,
      specialties: values.specialties,
      nok_passed: values.nok_passed,
      nrs_number: values.nrs_number,
      sro_gip_declared: values.sro_gip_declared,
      qualification_courses: values.qualification_courses,
      rtn_areas: values.rtn_areas,
    }),
    errorMessage: "Не удалось сохранить анкету проектировщика.",
  });

  return response.json();
}
