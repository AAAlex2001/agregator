"use client";

import { useEffect } from "react";
import { ExpertMapVisibilityFields } from "@/source/entities/expert";
import type { UserProfile } from "@/source/entities/user";
import Button from "@/source/shared/ui/Button";
import { Checkbox, FormSection } from "@/source/shared/ui";
import { YandexAddressPicker } from "@/source/shared/ui/YandexMap";
import { useExpertLocation } from "../model/useExpertLocation";
import s from "./ExpertLocationForm.module.scss";

const SECTION_ID = "location-map";

interface ExpertLocationFormProps {
  profile: UserProfile;
}

/** Блок «Где вы находитесь»: город на карте, готовность к выездам и видимость на карте исполнителей. */
export function ExpertLocationForm({ profile }: ExpertLocationFormProps) {
  const { fields, isSaving, change, save } = useExpertLocation(profile);

  useEffect(() => {
    if (window.location.hash === `#${SECTION_ID}`) {
      document.getElementById(SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <FormSection
      id={SECTION_ID}
      title="Где вы находитесь"
      hint="Город и район базирования — заказчикам проще выбрать исполнителя рядом. Это не личный адрес."
      collapsible
    >
      <div className={s.body}>
        <YandexAddressPicker value={fields.location} onChange={(location) => change({ ...fields, location })} />

        <Checkbox id="expert-travels" checked={fields.travels} onChange={(travels) => change({ ...fields, travels })}>
          Готов выезжать на объекты в другие регионы
        </Checkbox>

        <ExpertMapVisibilityFields
          showOnMap={fields.showOnMap}
          mapFields={fields.mapFields}
          onChangeShowOnMap={(showOnMap) => change({ ...fields, showOnMap })}
          onChangeMapFields={(mapFields) => change({ ...fields, mapFields })}
        />

        <Button variant="chat" size="md" fullWidth isLoading={isSaving} onClick={save}>
          Сохранить
        </Button>
      </div>
    </FormSection>
  );
}
