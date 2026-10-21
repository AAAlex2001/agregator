import { EMPTY_BLITZ_COMPANY } from "@/entities/blitz-order";
import type { CreateBlitzOrderAction, CreateBlitzOrderState } from "./types";

/** Пустой черновик заявки организации. */
export const INITIAL_CREATE_BLITZ_ORDER_STATE: CreateBlitzOrderState = {
  objectCode: "",
  areaCode: "",
  requirement: "unknown",
  hazardClass: "",
  category: "",
  contractKind: "",
  objectName: "",
  deadline: "any",
  price: "",
  customerType: "legal",
  company: EMPTY_BLITZ_COMPANY,
  individual: {
    full_name: "",
    passport_number: "",
    passport_issued_by: "",
    passport_issued_at: "",
    address: "",
  },
  comment: "",
  step: 0,
  isSubmitting: false,
};

/** Черновик заявки: выбор объекта сбрасывает вид договора и неподходящую область. */
export function createBlitzOrderReducer(
  state: CreateBlitzOrderState,
  action: CreateBlitzOrderAction,
): CreateBlitzOrderState {
  switch (action.type) {
    case "object/change":
      return {
        ...state,
        objectCode: action.objectCode,
        areaCode: action.keepArea ? state.areaCode : "",
        contractKind: "",
      };
    case "area/change":
      return {
        ...state,
        areaCode: action.areaCode,
      };
    case "requirement/change":
      return {
        ...state,
        requirement: action.requirement,
      };
    case "field/change":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "deadline/change":
      return {
        ...state,
        deadline: action.deadline,
      };
    case "customer-type/change":
      return {
        ...state,
        customerType: action.customerType,
      };
    case "company/change":
      return {
        ...state,
        company: { ...state.company, [action.field]: action.value },
      };
    case "individual/change":
      return {
        ...state,
        individual: { ...state.individual, [action.field]: action.value },
      };
    case "requisites/fill":
      return {
        ...state,
        customerType: action.requisites.customer_type ?? state.customerType,
        company: action.requisites.company ?? state.company,
        individual: action.requisites.individual ?? state.individual,
      };
    case "step/go":
      return {
        ...state,
        step: action.step,
      };
    case "submit/start":
      return {
        ...state,
        isSubmitting: true,
      };
    case "submit/error":
      return {
        ...state,
        isSubmitting: false,
      };
  }
}
