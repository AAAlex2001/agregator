import type { LicenseRentalKind } from "@/source/shared/ui/RentalPriceField";
import type { DirectionFile } from "./files";

export interface SroHolderPayload {
  sro_name: string;
  sro_registry_number: string;
  hazardous_objects_right: boolean;
  nuclear_objects_right: boolean;
  liability_level: number;
  pricing_kind: LicenseRentalKind;
  pricing_percent: number | null;
  pricing_fixed_amount: number | null;
}

export interface SroHolderResponse extends SroHolderPayload {
  documents: DirectionFile[];
}

/** Анкета члена СРО в полях ввода: числа хранятся строками. */
export interface SroHolderProfile {
  sro_name: string;
  sro_registry_number: string;
  hazardous_objects_right: boolean;
  nuclear_objects_right: boolean;
  liability_level: string;
  pricing_kind: LicenseRentalKind;
  pricing_percent: string;
  pricing_fixed_amount: string;
  documents: DirectionFile[];
}

export const emptySroHolderProfile: SroHolderProfile = {
  sro_name: "",
  sro_registry_number: "",
  hazardous_objects_right: false,
  nuclear_objects_right: false,
  liability_level: "1",
  pricing_kind: "PERCENT",
  pricing_percent: "",
  pricing_fixed_amount: "",
  documents: [],
};

export const SRO_LIABILITY_LEVELS = [
  { value: "1", label: "1 уровень — до 25 млн рублей" },
  { value: "2", label: "2 уровень — до 50 млн рублей" },
  { value: "3", label: "3 уровень — до 300 млн рублей" },
  { value: "4", label: "4 уровень — более 300 млн рублей" },
];

/** Анкета члена СРО в формате API: уровень ответственности и цена — числами. */
export function sroHolderToApi(profile: SroHolderProfile): SroHolderPayload {
  return {
    sro_name: profile.sro_name,
    sro_registry_number: profile.sro_registry_number,
    hazardous_objects_right: profile.hazardous_objects_right,
    nuclear_objects_right: profile.nuclear_objects_right,
    liability_level: Number(profile.liability_level) || 1,
    pricing_kind: profile.pricing_kind,
    pricing_percent:
      profile.pricing_kind === "PERCENT" && profile.pricing_percent ? Number(profile.pricing_percent.replace(",", ".")) : null,
    pricing_fixed_amount:
      profile.pricing_kind === "FIXED" && profile.pricing_fixed_amount
        ? Number(profile.pricing_fixed_amount.replace(/\s/g, ""))
        : null,
  };
}

/** Анкета члена СРО из API — для полей ввода. */
export function sroHolderFromApi(data: SroHolderResponse): SroHolderProfile {
  return {
    ...data,
    liability_level: String(data.liability_level || 1),
    pricing_percent: data.pricing_percent === null ? "" : String(data.pricing_percent),
    pricing_fixed_amount: data.pricing_fixed_amount === null ? "" : String(data.pricing_fixed_amount),
  };
}
