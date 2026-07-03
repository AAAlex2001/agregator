import type { Party } from "@/entites/party";
import type { GeoPoint } from "@/entites/geo";
import type { Certificate, RentalKind } from "./api";

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
  | "miningNumber"
  | "labNumber"
  | "certArea"
  | "certObject"
  | "certCategory"
  | "code";

export type FileKey = "license" | "mining" | "sro" | "lab";
export type ConsentKey = "privacy" | "terms" | "personal";

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
  attested: boolean;
  certArea: string;
  certObject: string;
  certCategory: string;
  certificates: Certificate[];
  showOnMap: boolean;
  mapFields: string[];
  party: Party | null;
  companyName: string;
  licenseNumber: string;
  licenseAreas: string[];
  rentalKind: RentalKind;
  rentalPercent: string;
  rentalFixed: string;
  miningNumber: string;
  labNumber: string;
  files: Record<FileKey, File | null>;
  consents: Record<ConsentKey, boolean>;
  code: string;
}

export type RegisterAction =
  | { type: "set"; key: StringField; value: string }
  | { type: "travels"; value: boolean }
  | { type: "attested"; value: boolean }
  | { type: "showOnMap"; value: boolean }
  | { type: "mapFields"; value: string[] }
  | { type: "addCertificate" }
  | { type: "removeCertificate"; index: number }
  | { type: "location"; point: GeoPoint }
  | { type: "addressText"; value: string }
  | { type: "party"; party: Party }
  | { type: "companyText"; value: string }
  | { type: "areas"; value: string[] }
  | { type: "rentalKind"; value: RentalKind }
  | { type: "file"; key: FileKey; file: File | null }
  | { type: "consent"; key: ConsentKey; value: boolean }
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
  attested: false,
  certArea: "",
  certObject: "",
  certCategory: "",
  certificates: [],
  showOnMap: true,
  mapFields: ["name", "area", "object", "category"],
  party: null,
  companyName: "",
  licenseNumber: "",
  licenseAreas: [],
  rentalKind: "PERCENT",
  rentalPercent: "",
  rentalFixed: "",
  miningNumber: "",
  labNumber: "",
  files: { license: null, mining: null, sro: null, lab: null },
  consents: { privacy: false, terms: false, personal: false },
  code: "",
};

export function reducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case "set":
      return { ...state, [action.key]: action.value };
    case "travels":
      return { ...state, travels: action.value };
    case "attested":
      return { ...state, attested: action.value };
    case "showOnMap":
      return { ...state, showOnMap: action.value };
    case "mapFields":
      return { ...state, mapFields: action.value };
    case "addCertificate": {
      const cert = { area: state.certArea, object: state.certObject, category: state.certCategory };
      const exists = state.certificates.some(
        (c) => c.area === cert.area && c.object === cert.object && c.category === cert.category,
      );
      return {
        ...state,
        certificates: exists ? state.certificates : [...state.certificates, cert],
        certArea: "",
        certObject: "",
        certCategory: "",
      };
    }
    case "removeCertificate":
      return { ...state, certificates: state.certificates.filter((_, i) => i !== action.index) };
    case "location":
      return {
        ...state,
        locationAddress: action.point.address,
        locationLat: action.point.lat,
        locationLng: action.point.lng,
        locationCity: action.point.city,
      };
    case "addressText":
      return { ...state, locationAddress: action.value, locationLat: null, locationLng: null, locationCity: null };
    case "party":
      return { ...state, party: action.party, companyName: action.party.value };
    case "companyText":
      return { ...state, companyName: action.value, party: null };
    case "areas":
      return { ...state, licenseAreas: action.value };
    case "rentalKind":
      return { ...state, rentalKind: action.value };
    case "file":
      return { ...state, files: { ...state.files, [action.key]: action.file } };
    case "consent":
      return { ...state, consents: { ...state.consents, [action.key]: action.value } };
    case "step":
      return { ...state, step: action.value };
    case "busy":
      return { ...state, busy: action.value };
    case "reset":
      return initialState;
  }
}
