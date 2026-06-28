"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { Checkbox } from "@/source/shared/ui";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { YandexAddressPicker, type SelectedLocation } from "@/source/shared/ui/YandexMap";
import { updateExpertLocation } from "@/source/entities/user/api/profile.api";
import type { UserProfile } from "@/source/entities/user";
import form from "@/source/entities/user/ui/ProfileForm.module.scss";
import s from "./ExpertLocationSection.module.scss";

interface Props {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile | null) => void;
}

export function ExpertLocationSection({ profile, onProfileUpdate }: Props) {
  const { showSuccess, showError } = useNotifications();
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
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await updateExpertLocation({
        location_lat: location?.lat ?? null,
        location_lng: location?.lng ?? null,
        location_address: location?.address ?? null,
        location_city: location?.city ?? null,
        travels_to_other_regions: travels,
      });
      onProfileUpdate(updated);
      showSuccess("Локация сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить локацию");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={form.section}>
      <h2 className={form.subtitle}>Местоположение на карте</h2>
      <div className={s.body}>
        <p className={s.hint}>
          Укажите город (и район), где вы базируетесь, — заказчикам будет проще выбрать эксперта
          рядом. Это не личный адрес: достаточно города или района.
        </p>
        <YandexAddressPicker value={location} onChange={(next) => setLocation(next)} />
        <Checkbox id="expert-travels" checked={travels} onChange={setTravels}>
          Готов выезжать на объекты в другие регионы
        </Checkbox>
        <div className={s.actions}>
          <Button type="button" variant="primary" onClick={save} isLoading={saving}>
            Сохранить локацию
          </Button>
        </div>
      </div>
    </section>
  );
}
