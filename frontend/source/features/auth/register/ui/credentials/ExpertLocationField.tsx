import type { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/source/shared/ui";
import { YandexAddressPicker } from "@/source/shared/ui/YandexMap";
import type { RegisterFormValues } from "../../model/schema";
import s from "./ExpertLocationField.module.scss";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
}

export function ExpertLocationField({ form }: Props) {
  const { watch, setValue } = form;

  const locationLat = watch("locationLat");
  const locationLng = watch("locationLng");
  const locationValue =
    locationLat != null && locationLng != null
      ? { lat: locationLat, lng: locationLng, address: watch("locationAddress"), city: watch("locationCity") }
      : null;

  return (
    <div className={s.block}>
      <div className={s.head}>
        <span className={s.title}>Где вы находитесь</span>
        <span className={s.hint}>
          Укажите город (и район), где вы базируетесь, — заказчикам будет проще выбрать исполнителя
          рядом. Это не ваш личный адрес: достаточно города или района, где вам удобно работать. Можно
          заполнить позже в профиле.
        </span>
      </div>
      <YandexAddressPicker
        value={locationValue}
        onChange={(location) => {
          setValue("locationLat", location.lat);
          setValue("locationLng", location.lng);
          setValue("locationAddress", location.address);
          setValue("locationCity", location.city);
        }}
      />
      <Checkbox
        id="travelsToOtherRegions"
        checked={watch("travelsToOtherRegions")}
        onChange={(checked) => setValue("travelsToOtherRegions", checked)}
      >
        Готов выезжать на объекты в другие регионы
      </Checkbox>
    </div>
  );
}
