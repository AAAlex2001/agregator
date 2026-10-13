import {
  emptyAuditCustomerProfile,
  emptyAuditExpertProfile,
  emptyAuditLicenseHolderProfile,
} from "@/source/entities/directions/audit";
import { emptyCadastralProfile } from "@/source/entities/directions/cadastral";
import { emptyDesignProfile } from "@/source/entities/directions/design";
import { emptySroHolderProfile } from "@/source/entities/directions/shared";
import { emptyEcologyProfile } from "@/source/entities/directions/ecology";
import { emptyExpertiseProfile } from "@/source/entities/directions/expertise";
import { emptyForensicProfile } from "@/source/entities/directions/forensic";
import { emptyLaboratoryProfile } from "@/source/entities/directions/laboratory";
import { emptyResearchProfile } from "@/source/entities/directions/research";
import { emptySurveyProfile } from "@/source/entities/directions/survey";
import { emptyTechDiagHolderProfile, emptyTechDiagProfile } from "@/source/entities/directions/tech-diag";
import type { AuthDirection, AuthPreset } from "@/source/shared/lib/auth-modal";
import { EMPTY_DIRECTION_FILES } from "./directionFiles";
import type { RegisterAction, RegisterState } from "./types";

const NO_DIRECTIONS = {
  licenseEnabled: false,
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
  designProfile: null,
  designHolderProfile: null,
  ecologyProfile: null,
  surveyProfile: null,
  surveyHolderProfile: null,
  directionFiles: EMPTY_DIRECTION_FILES,
};

export const INITIAL_STATE: RegisterState = {
  ...NO_DIRECTIONS,
  isSubmitting: false,
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
  mapFields: ["name"],
  contactEnabled: false,
  contactPrice: "",
  contactDetails: "",
  contactConsent: false,
  party: null,
  companyName: "",
  licenseNumber: "",
  licenseAreas: [],
  rentalKind: "PERCENT",
  rentalPercent: "",
  rentalFixed: "",
  miningNumber: "",
  labNumber: "",
  files: { license: null, mining: null, sroDesign: null, sroSurvey: null, lab: null },
  consents: { privacy: false, terms: false, personal: false },
};

function withExpertDirection(state: RegisterState, direction: AuthDirection): RegisterState {
  switch (direction) {
    case "EXPERTISE":
      return { ...state, expertiseProfile: emptyExpertiseProfile };
    case "AUDIT_SUPB":
      return { ...state, auditExpertProfile: emptyAuditExpertProfile };
    case "CADASTRAL":
      return { ...state, cadastralProfile: emptyCadastralProfile };
    case "FORENSIC":
      return { ...state, forensicProfile: emptyForensicProfile };
    case "RESEARCH":
      return { ...state, researchProfile: emptyResearchProfile };
    case "LABORATORY":
      return { ...state, laboratoryProfile: emptyLaboratoryProfile };
    case "TECH_DIAG":
      return { ...state, techDiagProfile: emptyTechDiagProfile };
    case "DESIGN":
      return { ...state, designProfile: emptyDesignProfile };
    case "ECOLOGY":
      return { ...state, ecologyProfile: emptyEcologyProfile };
    case "SURVEY":
      return { ...state, surveyProfile: emptySurveyProfile };
  }
}

function withHolderDirection(state: RegisterState, direction: AuthDirection): RegisterState {
  switch (direction) {
    case "EXPERTISE":
      return { ...state, licenseEnabled: true };
    case "AUDIT_SUPB":
      return { ...state, auditHolderProfile: emptyAuditLicenseHolderProfile };
    case "TECH_DIAG":
      return { ...state, techDiagHolderProfile: emptyTechDiagHolderProfile };
    case "DESIGN":
      return { ...state, designHolderProfile: emptySroHolderProfile };
    case "SURVEY":
      return { ...state, surveyHolderProfile: emptySroHolderProfile };
    case "ECOLOGY":
      return state;
    default:
      return { ...state, directions: [direction] };
  }
}

function withCustomerDirection(state: RegisterState, direction: AuthDirection): RegisterState {
  if (direction === "AUDIT_SUPB") return { ...state, auditCustomerProfile: emptyAuditCustomerProfile };
  return { ...state, directions: [direction] };
}

/** Стартовое состояние: роль и направление, с которыми пришли с лендинга, уже выбраны. */
export function initRegisterState(preset: AuthPreset | null): RegisterState {
  if (!preset) return INITIAL_STATE;
  const state = { ...INITIAL_STATE, role: preset.role };
  if (!preset.direction) return state;
  if (preset.role === "EXPERT") return withExpertDirection(state, preset.direction);
  if (preset.role === "LICENSE_HOLDER") return withHolderDirection(state, preset.direction);
  return withCustomerDirection(state, preset.direction);
}

export function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case "submit/start":
      return { ...state, isSubmitting: true };
    case "submit/finish":
      return { ...state, isSubmitting: false };
    case "set":
      return { ...state, [action.key]: action.value };
    case "role":
      return { ...state, ...NO_DIRECTIONS, role: action.value };
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
    case "design":
      return { ...state, designProfile: action.value };
    case "designHolder":
      return { ...state, designHolderProfile: action.value };
    case "ecology":
      return { ...state, ecologyProfile: action.value };
    case "survey":
      return { ...state, surveyProfile: action.value };
    case "surveyHolder":
      return { ...state, surveyHolderProfile: action.value };
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
          [action.key]: state.directionFiles[action.key].filter((file) => file !== action.file),
        },
      };
    case "consent":
      return { ...state, consents: { ...state.consents, [action.key]: action.value } };
  }
}
