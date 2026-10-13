import { emptyOrderDetails } from "@/source/entities/directions/order";
import { emptyApplicant, pickApplicant, type ApplicantBlock } from "@/source/entities/directions/shared";
import { ALL_BADGE_CODES_SET } from "@/source/entities/expertise";
import { emptyDocuments, ORDER_WORK_OPTIONS, type OrderCardData } from "@/source/entities/order";
import type { UserProfile } from "@/source/entities/user";
import type { OrderFormAction, OrderFormState } from "./types";

export interface OrderFormSource {
  template?: OrderCardData;
  copySourceOrderId: number | null;
  user: UserProfile | null;
}

/** Заявитель по умолчанию — сам заказчик из профиля. */
function userApplicant(user: UserProfile | null): ApplicantBlock {
  if (!user) return emptyApplicant;
  return {
    applicant_full_name: [user.last_name, user.first_name].filter(Boolean).join(" "),
    applicant_position: "",
    applicant_organization: user.company_data?.value ?? "",
    applicant_inn: user.inn ?? "",
    applicant_phone: user.phone ?? "",
    applicant_email: user.email ?? "",
  };
}

/**
 * Пустая форма от имени заказчика, либо заполненная по заказу: своему для правки или образцу для копии.
 * Новый заказ открывается на первом направлении из профиля заказчика.
 */
export function initOrderForm({ template, copySourceOrderId, user }: OrderFormSource): OrderFormState {
  const firstDirection = ORDER_WORK_OPTIONS.find((option) => user?.directions.includes(option.value));
  const workType = template?.workType ?? firstDirection?.value ?? "EXPERTISE";
  const applicant = userApplicant(user);
  const empty = emptyOrderDetails(workType);
  return {
    title: template?.title ?? "",
    company: user?.company_data?.value || template?.company || "",
    startDate: template?.startDateRaw ?? "",
    deadline: template?.deadlineRaw ?? "",
    responsesDeadline: template?.responsesDeadline ?? "",
    budget: template && template.sumAmountRaw > 0 ? String(template.sumAmountRaw / 100) : "",
    comment: template?.comment ?? "",
    workType,
    requiresExpert: template?.requiresExpert ?? false,
    requiresLicense: template?.requiresLicense ?? false,
    badgeCodes: (template?.badgesRaw ?? []).map((badge) => badge.text).filter((code) => ALL_BADGE_CODES_SET.has(code)),
    details: empty ? { ...empty, ...applicant, ...template?.details } : null,
    applicant,
    documents: template?.documents ?? emptyDocuments(),
    files: { technical: null, contract: null, company: null, other: [] },
    copySourceOrderId,
    notifyResponders: true,
  };
}

export function orderFormReducer(state: OrderFormState, action: OrderFormAction): OrderFormState {
  switch (action.type) {
    case "field":
      return { ...state, [action.field]: action.value };
    case "workType": {
      if (action.value === state.workType) return state;
      const applicant = state.details ? pickApplicant(state.details) : state.applicant;
      const empty = emptyOrderDetails(action.value);
      const isExpertise = action.value === "EXPERTISE";
      return {
        ...state,
        workType: action.value,
        details: empty ? { ...empty, ...applicant } : null,
        badgeCodes: isExpertise ? state.badgeCodes : [],
        requiresExpert: isExpertise ? state.requiresExpert : true,
        requiresLicense: isExpertise ? state.requiresLicense : false,
      };
    }
    case "requiresExpert":
      return { ...state, requiresExpert: action.value };
    case "requiresLicense":
      return { ...state, requiresLicense: action.value };
    case "badgeCodes":
      return { ...state, badgeCodes: action.value };
    case "details":
      return { ...state, details: action.value };
    case "file":
      return {
        ...state,
        files: { ...state.files, [action.category]: action.file },
        documents: action.file ? { ...state.documents, [action.category]: [] } : state.documents,
      };
    case "otherFiles":
      return { ...state, files: { ...state.files, other: [...state.files.other, ...action.files] } };
    case "removeFile":
      return {
        ...state,
        files: {
          technical: state.files.technical === action.file ? null : state.files.technical,
          contract: state.files.contract === action.file ? null : state.files.contract,
          company: state.files.company === action.file ? null : state.files.company,
          other: state.files.other.filter((file) => file !== action.file),
        },
      };
    case "removeDocument":
      return { ...state, documents: { ...state.documents, [action.category]: [] } };
    case "removeOtherDocument":
      return { ...state, documents: { ...state.documents, other: state.documents.other.filter((path) => path !== action.path) } };
    case "notifyResponders":
      return { ...state, notifyResponders: action.value };
  }
}
