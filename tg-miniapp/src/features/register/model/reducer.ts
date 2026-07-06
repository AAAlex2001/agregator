import type { RegisterAction, RegisterState } from "./types";

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
