import type { Party } from "@/entites/party";
import type { GeoPoint } from "@/entites/geo";
import type { Certificate, RentalKind } from "@/entites/registration";

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
