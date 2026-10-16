import { ExpertMapVisibilityFields } from "@/entities/expert";
import { YandexAddressPicker } from "@/shared/ui/address-picker";
import { Checkbox } from "@/shared/ui/checkbox";
import { FormSection } from "@/shared/ui/form-section";
import type { ExpertLocation } from "../../model/expert";
import styles from "./style.module.scss";

/** Расположение и отображение на карте только по выбранным направлениям. */
interface LocationFieldsProps {
  value: ExpertLocation;
  onChange: (value: ExpertLocation) => void;
  activeDirections: string[];
}

/** Показывает адрес базирования, готовность к выезду и настройки публичной карты. */
export function LocationFields({
  value,
  onChange,
  activeDirections,
}: LocationFieldsProps) {
  return (
    <FormSection
      title="Где вы находитесь"
      hint={
        "Город и район базирования — заказчикам проще выбрать исполнителя рядом. "
        + "Это не личный адрес, можно заполнить позже в профиле."
      }
      collapsible
    >
      <div className={styles.location}>
        <YandexAddressPicker
          value={value.point}
          onChange={(point) => onChange({ ...value, point })}
        />
        <Checkbox
          id="register-travels"
          checked={value.travels}
          onChange={(travels) => onChange({ ...value, travels })}
        >
          Готов выезжать на объекты в другие регионы
        </Checkbox>
        <ExpertMapVisibilityFields
          showOnMap={value.showOnMap}
          mapFields={value.mapFields}
          onChangeShowOnMap={(showOnMap) => onChange({ ...value, showOnMap })}
          onChangeMapFields={(mapFields) => onChange({ ...value, mapFields })}
          activeDirections={activeDirections}
        />
      </div>
    </FormSection>
  );
}

