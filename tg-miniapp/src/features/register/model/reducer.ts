import type { Party } from "@/entites/party";
import type { GeoPoint } from "@/entites/geo";
import type { RentalKind } from "./api";

export type StringField =
  | "email"
  | "password"
  | "confirm"
  | "phone"
  | "firstName"
  | "lastName"
  | "locationAddress"
  | "companyName"
  | "licenseNumber"
  | "rentalPercent"
  | "rentalFixed"
  | "code";

export interface RegisterState {
  step: number;
  busy: boolean;
  email: string;
  password: string;
  confirm: string;
  phone: string;
  firstName: string;
  lastName: string;
  locationAddress: string;
  locationLat: number | null;
  locationLng: number | null;
  locationCity: string | null;
  travels: boolean;
  agree: boolean;
  code: string;
  party: Party | null;
  companyName: string;
  licenseNumber: string;
  licenseAreas: string[];
  rentalKind: RentalKind;
  rentalPercent: string;
  rentalFixed: string;
  file: File | null;
}

export type RegisterAction =
  | { type: "set"; key: StringField; value: string }
  | { type: "agree"; value: boolean }
  | { type: "travels"; value: boolean }
  | { type: "location"; point: GeoPoint }
  | { type: "party"; party: Party }
  | { type: "toggleArea"; area: string }
  | { type: "rentalKind"; value: RentalKind }
  | { type: "file"; file: File | null }
  | { type: "step"; value: number }
  | { type: "busy"; value: boolean }
  | { type: "reset" };

export const initialState: RegisterState = {
  step: 1,
  busy: false,
  email: "",
  password: "",
  confirm: "",
  phone: "",
  firstName: "",
  lastName: "",
  locationAddress: "",
  locationLat: null,
  locationLng: null,
  locationCity: null,
  travels: false,
  agree: false,
  code: "",
  party: null,
  companyName: "",
  licenseNumber: "",
  licenseAreas: [],
  rentalKind: "PERCENT",
  rentalPercent: "",
  rentalFixed: "",
  file: null,
};

export function reducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case "set":
      return { ...state, [action.key]: action.value };
    case "agree":
      return { ...state, agree: action.value };
    case "travels":
      return { ...state, travels: action.value };
    case "location":
      return {
        ...state,
        locationAddress: action.point.address,
        locationLat: action.point.lat,
        locationLng: action.point.lng,
        locationCity: action.point.city,
      };
    case "party":
      return { ...state, party: action.party, companyName: action.party.value };
    case "toggleArea":
      return {
        ...state,
        licenseAreas: state.licenseAreas.includes(action.area)
          ? state.licenseAreas.filter((a) => a !== action.area)
          : [...state.licenseAreas, action.area],
      };
    case "rentalKind":
      return { ...state, rentalKind: action.value };
    case "file":
      return { ...state, file: action.file };
    case "step":
      return { ...state, step: action.value };
    case "busy":
      return { ...state, busy: action.value };
    case "reset":
      return initialState;
  }
}
