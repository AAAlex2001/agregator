import type { SelectedLocation } from "@/shared/ui/address-picker";

/** Поля формы местоположения и видимости исполнителя на карте. */
export interface ExpertLocationFields {
  location: SelectedLocation | null;
  travels: boolean;
  showOnMap: boolean;
  mapFields: string[];
}
