import { DEFAULT_MAP_FIELDS } from "@/entities/expert";
import type { UserProfile } from "@/entities/user";
import type { ExpertLocationFields } from "./types";

/** Заполняет форму сохранёнными координатами и настройками карты. */
export function getExpertLocationFields(
  profile: UserProfile,
): ExpertLocationFields {
  const expert = profile.expert;

  return {
    location: expert
      && expert.location_lat !== null
      && expert.location_lng !== null
      ? {
          lat: expert.location_lat,
          lng: expert.location_lng,
          address: expert.location_address ?? "",
          city: expert.location_city,
        }
      : null,
    travels: expert?.travels_to_other_regions ?? false,
    showOnMap: expert?.show_on_map ?? true,
    mapFields: expert?.map_fields ?? DEFAULT_MAP_FIELDS,
  };
}
