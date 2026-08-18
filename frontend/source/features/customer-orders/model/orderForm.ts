import type { OrderCardData, OrderWorkType } from "@/source/entities/order";
import type { ApplicantBlock } from "@/source/features/directions/shared/model/applicant";
import type { AuditOrderDetails } from "@/source/features/directions/audit";
import type { CadastralOrderDetails } from "@/source/features/directions/cadastral";
import type { DesignOrderDetails } from "@/source/features/directions/design";
import type { EcologyOrderDetails } from "@/source/features/directions/ecology";
import type { ForensicOrderDetails } from "@/source/features/directions/forensic";
import type { LaboratoryOrderDetails } from "@/source/features/directions/laboratory";
import type { ResearchOrderDetails } from "@/source/features/directions/research";
import type { TechDiagOrderDetails } from "@/source/features/directions/tech-diag";
import { emptyDirectionDetails } from "./orderDetails";
import { initialDocumentsFormState, type DocumentsFormState } from "@/source/entities/order";
import { getDefaultValues } from "./mappers";
import { loadDraft } from "./orderDraft";

export interface OrderFormValues {
  title: string;
  company: string;
  startDate: string;
  deadline: string;
  responsesDeadline: string;
  budget: string;
  selectionsByType: Record<string, string[]>;
  comment: string;
  requiresExpert: boolean;
  requiresLicense: boolean;
  workType: OrderWorkType;
  cadastralDetails: CadastralOrderDetails;
  forensicDetails: ForensicOrderDetails;
  researchDetails: ResearchOrderDetails;
  laboratoryDetails: LaboratoryOrderDetails;
  auditDetails: AuditOrderDetails;
  techDiagDetails: TechDiagOrderDetails;
  designDetails: DesignOrderDetails;
  ecologyDetails: EcologyOrderDetails;
}

export type StringField =
  | "title"
  | "company"
  | "startDate"
  | "deadline"
  | "responsesDeadline"
  | "budget"
  | "comment";

export type SingleCategory = "technical" | "contract" | "company";

export interface OrderFormState extends OrderFormValues {
  documents: DocumentsFormState;
  notifyResponders: boolean;
}

export type OrderFormAction =
  | { type: "set"; key: StringField; value: string }
  | { type: "workType"; value: OrderWorkType }
  | { type: "requiresExpert"; value: boolean }
  | { type: "requiresLicense"; value: boolean }
  | { type: "notifyResponders"; value: boolean }
  | { type: "selections"; value: Record<string, string[]> }
  | { type: "cadastral"; value: CadastralOrderDetails }
  | { type: "forensic"; value: ForensicOrderDetails }
  | { type: "research"; value: ResearchOrderDetails }
  | { type: "laboratory"; value: LaboratoryOrderDetails }
  | { type: "audit"; value: AuditOrderDetails }
  | { type: "techDiag"; value: TechDiagOrderDetails }
  | { type: "design"; value: DesignOrderDetails }
  | { type: "ecology"; value: EcologyOrderDetails }
  | { type: "applicantDefaults"; value: ApplicantBlock }
  | { type: "docSingle"; category: SingleCategory; file: File | null }
  | { type: "docRemoveSingleExisting"; category: SingleCategory }
  | { type: "docAddOther"; files: File[] }
  | { type: "docRemoveOtherNew"; index: number }
  | { type: "docRemoveOtherExisting"; index: number };

export function initOrderForm(source: {
  editTarget?: OrderCardData;
  copyTemplate?: OrderCardData;
}): OrderFormState {
  const card = source.copyTemplate ?? source.editTarget;
  const values = card ? getDefaultValues(card) : { ...getDefaultValues(), ...(loadDraft() ?? {}) };
  return {
    ...values,
    documents: initialDocumentsFormState(card?.documents, source.copyTemplate?.id ?? null),
    notifyResponders: true,
  };
}

export function orderFormValues(state: OrderFormState): OrderFormValues {
  return {
    title: state.title,
    company: state.company,
    startDate: state.startDate,
    deadline: state.deadline,
    responsesDeadline: state.responsesDeadline,
    budget: state.budget,
    selectionsByType: state.selectionsByType,
    comment: state.comment,
    requiresExpert: state.requiresExpert,
    requiresLicense: state.requiresLicense,
    workType: state.workType,
    cadastralDetails: state.cadastralDetails,
    forensicDetails: state.forensicDetails,
    researchDetails: state.researchDetails,
    laboratoryDetails: state.laboratoryDetails,
    auditDetails: state.auditDetails,
    techDiagDetails: state.techDiagDetails,
    designDetails: state.designDetails,
    ecologyDetails: state.ecologyDetails,
  };
}

function fillApplicant<T extends ApplicantBlock>(details: T, defaults: ApplicantBlock): T {
  return {
    ...details,
    applicant_full_name: details.applicant_full_name || defaults.applicant_full_name,
    applicant_position: details.applicant_position || defaults.applicant_position,
    applicant_organization: details.applicant_organization || defaults.applicant_organization,
    applicant_inn: details.applicant_inn || defaults.applicant_inn,
    applicant_phone: details.applicant_phone || defaults.applicant_phone,
    applicant_email: details.applicant_email || defaults.applicant_email,
  };
}

export function reducer(state: OrderFormState, action: OrderFormAction): OrderFormState {
  switch (action.type) {
    case "set":
      return { ...state, [action.key]: action.value };
    case "workType": {
      if (action.value === state.workType) return state;
      const next = { ...state, workType: action.value, ...emptyDirectionDetails() };
      if (action.value !== "EXPERTISE") {
        next.selectionsByType = {};
        next.requiresExpert = true;
        next.requiresLicense = false;
      }
      return next;
    }
    case "requiresExpert":
      return { ...state, requiresExpert: action.value };
    case "requiresLicense":
      return { ...state, requiresLicense: action.value };
    case "notifyResponders":
      return { ...state, notifyResponders: action.value };
    case "selections":
      return { ...state, selectionsByType: action.value };
    case "cadastral":
      return { ...state, cadastralDetails: action.value };
    case "forensic":
      return { ...state, forensicDetails: action.value };
    case "research":
      return { ...state, researchDetails: action.value };
    case "laboratory":
      return { ...state, laboratoryDetails: action.value };
    case "audit":
      return { ...state, auditDetails: action.value };
    case "techDiag":
      return { ...state, techDiagDetails: action.value };
    case "design":
      return { ...state, designDetails: action.value };
    case "ecology":
      return { ...state, ecologyDetails: action.value };
    case "applicantDefaults":
      return {
        ...state,
        cadastralDetails: fillApplicant(state.cadastralDetails, action.value),
        forensicDetails: fillApplicant(state.forensicDetails, action.value),
        researchDetails: fillApplicant(state.researchDetails, action.value),
        laboratoryDetails: fillApplicant(state.laboratoryDetails, action.value),
        auditDetails: fillApplicant(state.auditDetails, action.value),
        techDiagDetails: fillApplicant(state.techDiagDetails, action.value),
        designDetails: fillApplicant(state.designDetails, action.value),
        ecologyDetails: fillApplicant(state.ecologyDetails, action.value),
      };
    case "docSingle":
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.category]: {
            newFile: action.file,
            existing: action.file ? null : state.documents[action.category].existing,
          },
        },
      };
    case "docRemoveSingleExisting":
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.category]: { newFile: state.documents[action.category].newFile, existing: null },
        },
      };
    case "docAddOther":
      return {
        ...state,
        documents: {
          ...state.documents,
          other: { ...state.documents.other, newFiles: [...state.documents.other.newFiles, ...action.files] },
        },
      };
    case "docRemoveOtherNew":
      return {
        ...state,
        documents: {
          ...state.documents,
          other: {
            ...state.documents.other,
            newFiles: state.documents.other.newFiles.filter((_, i) => i !== action.index),
          },
        },
      };
    case "docRemoveOtherExisting":
      return {
        ...state,
        documents: {
          ...state.documents,
          other: {
            ...state.documents.other,
            existing: state.documents.other.existing.filter((_, i) => i !== action.index),
          },
        },
      };
  }
}
