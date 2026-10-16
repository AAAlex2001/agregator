"use client";

import { useState } from "react";
import { useUpdateExpertLocation } from "@/entities/user";
import type { UserProfile } from "@/entities/user";
import type { SelectedLocation } from "@/shared/ui/address-picker";
import { useNotifications } from "@/shared/ui/notifications";
import { getExpertLocationFields } from "./location-fields";

/** Редактирует точку на карте, готовность к выездам и видимость анкеты. */
export function useExpertLocationForm(profile: UserProfile) {
  const { isSaving, saveLocation } = useUpdateExpertLocation();
  const { showError, showSuccess } = useNotifications();
  const [fields, setFields] = useState(() => getExpertLocationFields(profile));

  /** Сохраняет выбранный адрес вместе с его координатами. */
  function changeLocation(location: SelectedLocation) {
    setFields((current) => ({
      ...current,
      location,
    }));
  }

  /** Меняет готовность исполнителя работать в других регионах. */
  function changeTravels(travels: boolean) {
    setFields((current) => ({
      ...current,
      travels,
    }));
  }

  /** Меняет видимость исполнителя на публичной карте. */
  function changeShowOnMap(showOnMap: boolean) {
    setFields((current) => ({
      ...current,
      showOnMap,
    }));
  }

  /** Меняет сведения анкеты, которые увидят посетители карты. */
  function changeMapFields(mapFields: string[]) {
    setFields((current) => ({
      ...current,
      mapFields,
    }));
  }

  /** Отправляет настройки карты, сохраняя введённые поля при ошибке. */
  async function save() {
    if (isSaving) {
      return;
    }

    try {
      await saveLocation({
        location_lat: fields.location?.lat ?? null,
        location_lng: fields.location?.lng ?? null,
        location_address: fields.location?.address ?? null,
        location_city: fields.location?.city ?? null,
        travels_to_other_regions: fields.travels,
        show_on_map: fields.showOnMap,
        map_fields: fields.mapFields,
      });
      showSuccess("Местоположение сохранено");
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить местоположение",
      );
    }
  }

  return {
    fields,
    isSaving,
    changeLocation,
    changeTravels,
    changeShowOnMap,
    changeMapFields,
    save,
  };
}
