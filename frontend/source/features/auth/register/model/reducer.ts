import type { AuthPreset } from "@/source/shared/lib/auth-modal";
import {
  emptyAuditCustomerProfile,
  emptyAuditExpertProfile,
  emptyAuditLicenseHolderProfile,
} from "@/source/features/directions/audit";
import { emptyResearchProfile } from "@/source/features/directions/research";
import { emptyLaboratoryProfile } from "@/source/features/directions/laboratory";
import { emptyCadastralProfile } from "@/source/features/directions/cadastral";
import { emptyForensicProfile } from "@/source/features/directions/forensic";
import {
  emptyTechDiagHolderProfile,
  emptyTechDiagProfile,
} from "@/source/features/directions/tech-diag";
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
  directions: [],
  expertiseProfile: null,
  auditExpertProfile: null,
  auditCustomerProfile: null,
  auditHolderProfile: null,
  cadastralProfile: null,
  forensicProfile: null,
  researchProfile: null,
  laboratoryProfile: null,
  techDiagProfile: null,
  techDiagHolderProfile: null,
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

  if (preset.direction === "AUDIT_SUPB") {
    if (preset.role === "CUSTOMER") state.auditCustomerProfile = { ...emptyAuditCustomerProfile };
    if (preset.role === "EXPERT") state.auditExpertProfile = { ...emptyAuditExpertProfile };
    if (preset.role === "LICENSE_HOLDER") {
      state.auditHolderProfile = { ...emptyAuditLicenseHolderProfile };
      state.licenseEnabled = false;
    }
  }
  if (preset.direction === "RESEARCH" && preset.role === "EXPERT") {
    state.researchProfile = { ...emptyResearchProfile };
  }
  if (preset.direction === "LABORATORY" && preset.role === "EXPERT") {
    state.laboratoryProfile = { ...emptyLaboratoryProfile };
  }
  if (preset.direction === "TECH_DIAG") {
    if (preset.role === "EXPERT") state.techDiagProfile = { ...emptyTechDiagProfile };
    if (preset.role === "LICENSE_HOLDER") {
      state.techDiagHolderProfile = { ...emptyTechDiagHolderProfile };
      state.licenseEnabled = false;
    }
  }
  if (preset.direction === "CADASTRAL" && preset.role === "EXPERT") {
    state.cadastralProfile = { ...emptyCadastralProfile };
  }
  if (preset.direction === "FORENSIC" && preset.role === "EXPERT") {
    state.forensicProfile = { ...emptyForensicProfile };
  }
  if (preset.direction && preset.role === "CUSTOMER" && preset.direction !== "AUDIT_SUPB") {
    state.directions = [preset.direction];
  }
  if (
    preset.direction &&
    preset.role === "LICENSE_HOLDER" &&
    preset.direction !== "AUDIT_SUPB" &&
    preset.direction !== "TECH_DIAG"
  ) {
    state.directions = [preset.direction];
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
        directions: [],
        expertiseProfile: null,
        auditExpertProfile: null,
        auditCustomerProfile: null,
        auditHolderProfile: null,
        cadastralProfile: null,
        forensicProfile: null,
        researchProfile: null,
        laboratoryProfile: null,
        techDiagProfile: null,
        techDiagHolderProfile: null,
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
    case "direction":
      return {
        ...state,
        directions: action.value
          ? [...state.directions, action.key]
          : state.directions.filter((key) => key !== action.key),
      };
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
    case "techDiag":
      return { ...state, techDiagProfile: action.value };
    case "techDiagHolder":
      return { ...state, techDiagHolderProfile: action.value };
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
