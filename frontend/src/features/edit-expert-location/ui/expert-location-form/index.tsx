"use client";

import { useEffect } from "react";
import { ExpertMapVisibilityFields } from "@/entities/expert";
import type { UserProfile } from "@/entities/user";
import { YandexAddressPicker } from "@/shared/ui/address-picker";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { FormSection } from "@/shared/ui/form-section";
import { useExpertLocationForm } from "../../model/use-expert-location-form";
import styles from "./style.module.scss";

/** Якорь настроек карты для перехода из других разделов кабинета. */
const SECTION_ID = "location-map";

/** Профиль исполнителя с сохранёнными настройками публичной карты. */
interface ExpertLocationFormProps {
  profile: UserProfile;
}

/** Настраивает местоположение, выезды и сведения исполнителя на карте. */
export function ExpertLocationForm({ profile }: ExpertLocationFormProps) {
  const {
    fields,
    isSaving,
    changeLocation,
    changeTravels,
    changeShowOnMap,
    changeMapFields,
    save,
  } = useExpertLocationForm(profile);

  useEffect(() => {
    if (window.location.hash === `#${SECTION_ID}`) {
      document.getElementById(SECTION_ID)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  return (
    <FormSection
      id={SECTION_ID}
      title="Где вы находитесь"
      hint={
        "Город и район базирования — заказчикам проще выбрать исполнителя рядом. "
        + "Это не личный адрес."
      }
      collapsible
    >
      <div className={styles.body}>
        <YandexAddressPicker
          value={fields.location}
          onChange={changeLocation}
        />

        <Checkbox
          id="expert-travels"
          checked={fields.travels}
          onChange={changeTravels}
        >
          Готов выезжать на объекты в другие регионы
        </Checkbox>

        <ExpertMapVisibilityFields
          showOnMap={fields.showOnMap}
          mapFields={fields.mapFields}
          onChangeShowOnMap={changeShowOnMap}
          onChangeMapFields={changeMapFields}
        />

        <Button
          variant="chat"
          size="md"
          fullWidth
          isLoading={isSaving}
          onClick={save}
        >
          Сохранить
        </Button>
      </div>
    </FormSection>
  );
}
