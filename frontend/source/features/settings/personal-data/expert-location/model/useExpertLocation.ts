"use client";

import { useState } from "react";
import { DEFAULT_MAP_FIELDS } from "@/source/entities/expert";
import { useSession } from "@/source/entities/session";
import { updateExpertLocation, type UserProfile } from "@/source/entities/user";
import { useNotifications } from "@/source/shared/ui/Notifications";
import type { SelectedLocation } from "@/source/shared/ui/YandexMap";

interface LocationFields {
  location: SelectedLocation | null;
  travels: boolean;
  showOnMap: boolean;
  mapFields: string[];
}

const toFields = (profile: UserProfile): LocationFields => {
  const expert = profile.expert;

  return {
    location:
      expert && expert.location_lat !== null && expert.location_lng !== null
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
};

/** Где находится исполнитель: точка на карте, выезды в другие регионы и что показывать на карте. */
export function useExpertLocation(profile: UserProfile) {
  const { setUser } = useSession();
  const { showError, showSuccess } = useNotifications();
  const [fields, setFields] = useState(() => toFields(profile));
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    setIsSaving(true);
    try {
      setUser(
        await updateExpertLocation({
          location_lat: fields.location?.lat ?? null,
          location_lng: fields.location?.lng ?? null,
          location_address: fields.location?.address ?? null,
          location_city: fields.location?.city ?? null,
          travels_to_other_regions: fields.travels,
          show_on_map: fields.showOnMap,
          map_fields: fields.mapFields,
        }),
      );
      showSuccess("Местоположение сохранено");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить местоположение");
    } finally {
      setIsSaving(false);
    }
  };

  return { fields, isSaving, change: setFields, save };
}
