import type { ServiceRequestAction, ServiceRequestState } from "./types";

export const initialServiceRequestState: ServiceRequestState = {
  variant: "nir",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  description: "",
  responsesDeadline: "",
  startDate: "",
  dueDate: "",
  maxPrice: "",
  attachments: [],
  topic: "",
  executorRequirements: [{ id: 1, value: "" }],
  needsSiteVisit: false,
  nextRequirementId: 2,
  researchName: "",
  equipmentRequirements: "",
  agreePrivacy: false,
  agreeTerms: false,
  agreeConsent: false,
};

export function serviceRequestReducer(
  state: ServiceRequestState,
  action: ServiceRequestAction,
): ServiceRequestState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_VARIANT":
      return { ...state, variant: action.variant };
    case "ADD_FILES":
      return { ...state, attachments: [...state.attachments, ...action.attachments] };
    case "REMOVE_FILE":
      return {
        ...state,
        attachments: state.attachments.filter((_, index) => index !== action.index),
      };
    case "TOGGLE_SITE_VISIT":
      return { ...state, needsSiteVisit: !state.needsSiteVisit };
    case "TOGGLE_AGREEMENT":
      return { ...state, [action.agreement]: !state[action.agreement] };
    case "ADD_REQUIREMENT":
      return {
        ...state,
        executorRequirements: [
          ...state.executorRequirements,
          { id: state.nextRequirementId, value: "" },
        ],
        nextRequirementId: state.nextRequirementId + 1,
      };
    case "SET_REQUIREMENT":
      return {
        ...state,
        executorRequirements: state.executorRequirements.map((item) =>
          item.id === action.id ? { ...item, value: action.value } : item,
        ),
      };
    case "REMOVE_REQUIREMENT":
      return {
        ...state,
        executorRequirements: state.executorRequirements.filter((item) => item.id !== action.id),
      };
    default:
      return state;
  }
}
