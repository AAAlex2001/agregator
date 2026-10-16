import { createOrderDetails } from "./create-order-details";
import type { OrderApplicant } from "./details/applicant";
import type { OrderFormAction, OrderFormValues } from "./order-form-types";

/** Переносит только сведения о заявителе при смене вида работ. */
function getApplicant(details: OrderApplicant): OrderApplicant {
  return {
    applicant_full_name: details.applicant_full_name,
    applicant_position: details.applicant_position,
    applicant_organization: details.applicant_organization,
    applicant_inn: details.applicant_inn,
    applicant_phone: details.applicant_phone,
    applicant_email: details.applicant_email,
  };
}

/** Обновляет условия и файлы заказа, сохраняя остальные поля черновика. */
export function orderFormReducer(
  state: OrderFormValues,
  action: OrderFormAction,
): OrderFormValues {
  switch (action.type) {
    case "field/changed":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "direction/changed": {
      if (action.workType === state.workType) {
        return state;
      }

      const applicant = state.details
        ? getApplicant(state.details)
        : state.applicant;
      const isExpertise = action.workType === "EXPERTISE";

      return {
        ...state,
        workType: action.workType,
        details: createOrderDetails(action.workType, applicant),
        badgeCodes: isExpertise ? state.badgeCodes : [],
        requiresExpert: isExpertise ? state.requiresExpert : true,
        requiresLicense: isExpertise ? state.requiresLicense : false,
      };
    }
    case "expert/changed":
      return {
        ...state,
        requiresExpert: action.isRequired,
      };
    case "license/changed":
      return {
        ...state,
        requiresLicense: action.isRequired,
      };
    case "badges/changed":
      return {
        ...state,
        badgeCodes: action.codes,
      };
    case "details/changed":
      if (action.workType !== state.workType) {
        return state;
      }

      return {
        ...state,
        details: action.details,
      };
    case "audit-document/changed":
      if (
        state.workType !== "AUDIT_SUPB" ||
        !state.details ||
        !("audit_scale" in state.details)
      ) {
        return state;
      }

      return {
        ...state,
        details: {
          ...state.details,
          [action.field]: action.document,
        },
      };
    case "file/selected":
      return {
        ...state,
        files: {
          ...state.files,
          [action.category]: action.file,
        },
        documents: {
          ...state.documents,
          [action.category]: [],
        },
      };
    case "other-files/added":
      return {
        ...state,
        files: {
          ...state.files,
          other: [...state.files.other, ...action.files],
        },
      };
    case "file/removed":
      return {
        ...state,
        files: {
          technical: state.files.technical?.file === action.file
            ? null
            : state.files.technical,
          contract: state.files.contract?.file === action.file
            ? null
            : state.files.contract,
          company: state.files.company?.file === action.file
            ? null
            : state.files.company,
          other: state.files.other.filter((selected) => (
            selected.file !== action.file
          )),
        },
      };
    case "document/removed":
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.category]: [],
        },
      };
    case "other-document/removed":
      return {
        ...state,
        documents: {
          ...state.documents,
          other: state.documents.other.filter((path) => path !== action.path),
        },
      };
    case "notifications/changed":
      return {
        ...state,
        notifyResponders: action.isEnabled,
      };
  }
}
