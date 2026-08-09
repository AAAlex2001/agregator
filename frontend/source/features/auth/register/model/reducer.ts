import type { AuthPreset } from "@/source/shared/lib/auth-modal";
import {
  emptyAuditCustomerProfile,
  emptyAuditExpertProfile,
  emptyAuditLicenseHolderProfile,
} from "@/source/features/directions/audit";
import { emptyDirectionFiles } from "./directionFiles";
import type { RegisterAction, RegisterState } from "./types";

export const initialState: RegisterState = {
  waiting: false,
  error: null,
  role: "CUSTOMER",
  email: "",
  password: "",
  confirm: "",
  phone: "",
  firstName: "",
  lastName: "",
  location: null,
  travels: false,
  showOnMap: true,
  mapFields: ["name", "area", "object", "category"],
  contactEnabled: false,
  contactPrice: "",
  contactDetails: "",
  contactConsent: false,
  party: null,
  companyName: "",
  expertiseProfile: null,
  auditExpertProfile: null,
  auditCustomerProfile: null,
  auditHolderProfile: null,
  cadastralProfile: null,
  forensicProfile: null,
  researchProfile: null,
  laboratoryProfile: null,
  directionFiles: emptyDirectionFiles,
  licenseEnabled: true,
  licenseNumber: "",
  licenseAreas: [],
  rentalKind: "PERCENT",
  rentalPercent: "",
  rentalFixed: "",
  miningNumber: "",
  labNumber: "",
  files: { license: null, mining: null, sro: null, lab: null },
  consents: { privacy: false, terms: false, personal: false },
};

export function initFromPreset(preset: AuthPreset | null): RegisterState {
  if (!preset) return initialState;

  const state = { ...initialState, role: preset.role };
  if (preset.direction !== "AUDIT_SUPB") return state;

  if (preset.role === "CUSTOMER") state.auditCustomerProfile = { ...emptyAuditCustomerProfile };
  if (preset.role === "EXPERT") state.auditExpertProfile = { ...emptyAuditExpertProfile };
  if (preset.role === "LICENSE_HOLDER") {
    state.auditHolderProfile = { ...emptyAuditLicenseHolderProfile };
    state.licenseEnabled = false;
  }
  return state;
}

export function reducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case "SUBMIT_PENDING":
      return { ...state, waiting: true, error: null };
    case "SUBMIT_FULFILLED":
      return { ...state, waiting: false, error: null };
    case "SUBMIT_REJECTED":
      return { ...state, waiting: false, error: action.payload };
    case "set":
      return { ...state, [action.key]: action.value };
    case "role":
      return {
        ...state,
        role: action.value,
        licenseEnabled: true,
        expertiseProfile: null,
        auditExpertProfile: null,
        auditCustomerProfile: null,
        auditHolderProfile: null,
        cadastralProfile: null,
        forensicProfile: null,
        researchProfile: null,
        laboratoryProfile: null,
        directionFiles: emptyDirectionFiles,
      };
    case "travels":
      return { ...state, travels: action.value };
    case "showOnMap":
      return { ...state, showOnMap: action.value };
    case "mapFields":
      return { ...state, mapFields: action.value };
    case "contactEnabled":
      return { ...state, contactEnabled: action.value };
    case "contactConsent":
      return { ...state, contactConsent: action.value };
    case "location":
      return { ...state, location: action.point };
    case "party":
      return { ...state, party: action.party, companyName: action.party.value };
    case "companyText":
      return { ...state, companyName: action.value, party: null };
    case "expertise":
      return { ...state, expertiseProfile: action.value };
    case "auditExpert":
      return { ...state, auditExpertProfile: action.value };
    case "auditCustomer":
      return { ...state, auditCustomerProfile: action.value };
    case "auditHolder":
      return { ...state, auditHolderProfile: action.value };
    case "cadastral":
      return { ...state, cadastralProfile: action.value };
    case "forensic":
      return { ...state, forensicProfile: action.value };
    case "research":
      return { ...state, researchProfile: action.value };
    case "laboratory":
      return { ...state, laboratoryProfile: action.value };
    case "licenseEnabled":
      return { ...state, licenseEnabled: action.value };
    case "areas":
      return { ...state, licenseAreas: action.value };
    case "rentalKind":
      return { ...state, rentalKind: action.value };
    case "file":
      return { ...state, files: { ...state.files, [action.key]: action.file } };
    case "docFile":
      return { ...state, directionFiles: { ...state.directionFiles, [action.key]: action.file } };
    case "docAdd":
      return {
        ...state,
        directionFiles: {
          ...state.directionFiles,
          [action.key]: [...state.directionFiles[action.key], ...action.files],
        },
      };
    case "docRemove":
      return {
        ...state,
        directionFiles: {
          ...state.directionFiles,
          [action.key]: state.directionFiles[action.key].filter((_, i) => i !== action.index),
        },
      };
    case "consent":
      return { ...state, consents: { ...state.consents, [action.key]: action.value } };
  }
}
