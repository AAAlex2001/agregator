"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/source/shared/ui";
import { YandexAddressPicker, type SelectedLocation } from "@/source/shared/ui/YandexMap";
import { updateExpertLocation } from "@/source/entities/user/api/profile.api";
import { useRegisterProfileSave, type UserProfile } from "@/source/entities/user";
import form from "@/source/entities/user/ui/ProfileForm.module.scss";
import s from "./ExpertLocationSection.module.scss";

interface Props {
  profile: UserProfile;
}

export function ExpertLocationSection({ profile }: Props) {
  const [location, setLocation] = useState<SelectedLocation | null>(
    profile.location_lat != null && profile.location_lng != null
      ? {
          lat: profile.location_lat,
          lng: profile.location_lng,
          address: profile.location_address ?? "",
          city: profile.location_city,
        }
      : null,
  );
  const [travels, setTravels] = useState(profile.travels_to_other_regions);
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
    <section id="location-map" className={form.section} style={{ scrollMarginTop: 100 }}>
      <h2 className={form.subtitle}>Местоположение на карте</h2>
      <div className={s.body}>
        <p className={s.hint}>
          Укажите город (и район), где вы базируетесь, — заказчикам будет проще выбрать исполнителя
          рядом. Это не личный адрес: достаточно города или района.
        </p>
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
    </section>
  );
}
