"use client";

import { useEffect, useState } from "react";
import { Checkbox, FormSection } from "@/source/shared/ui";
import { YandexAddressPicker, type SelectedLocation } from "@/source/shared/ui/YandexMap";
import { updateExpertLocation } from "@/source/entities/user/api/profile.api";
import { useRegisterProfileSave, type UserProfile } from "@/source/entities/user";
import s from "./ExpertLocationSection.module.scss";

interface Props {
  profile: UserProfile;
}

export function ExpertLocationSection({ profile }: Props) {
  const expert = profile.expert;
  const [location, setLocation] = useState<SelectedLocation | null>(
    expert?.location_lat != null && expert.location_lng != null
      ? {
          lat: expert.location_lat,
          lng: expert.location_lng,
          address: expert.location_address ?? "",
          city: expert.location_city,
        }
      : null,
  );
  const [travels, setTravels] = useState(expert?.travels_to_other_regions ?? false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#location-map") {
      document.getElementById("location-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useRegisterProfileSave(async () => {
    if (!isDirty) return;
    await updateExpertLocation({
      location_lat: location?.lat ?? null,
      location_lng: location?.lng ?? null,
      location_address: location?.address ?? null,
      location_city: location?.city ?? null,
      travels_to_other_regions: travels,
    });
    setIsDirty(false);
  });

  return (
    <FormSection
      id="location-map"
      title="Местоположение на карте"
      hint="Укажите город (и район), где вы базируетесь, — заказчикам будет проще выбрать исполнителя рядом. Это не личный адрес: достаточно города или района."
    >
      <div className={s.body}>
        <YandexAddressPicker
          value={location}
          onChange={(next) => {
            setLocation(next);
            setIsDirty(true);
          }}
        />
        <Checkbox
          id="expert-travels"
          checked={travels}
          onChange={(next) => {
            setTravels(next);
            setIsDirty(true);
          }}
        >
          Готов выезжать на объекты в другие регионы
        </Checkbox>
      </div>
    </FormSection>
  );
}
