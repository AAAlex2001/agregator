import { EMPTY_BLITZ_COMPANY } from "@/entities/blitz-order";
import type { BlitzAuditObject } from "@/entities/blitz-order";
import type { CreateBlitzAuditAction, CreateBlitzAuditState } from "./types";

/** Пустой ОПО. */
const EMPTY_OBJECT: BlitzAuditObject = {
  reg_number: "",
  name: "",
  hazard_class: "",
  address: "",
  industry: "",
  hazard_signs: [],
};

/** Пустой черновик заявки на аудит одного ОПО. */
export const INITIAL_CREATE_BLITZ_AUDIT_STATE: CreateBlitzAuditState = {
  applicant: {
    full_name: "",
    position: "",
    organization: "",
    inn: "",
    phone: "",
    email: "",
    by_proxy: false,
  },
  scope: "one",
  objects: [EMPTY_OBJECT],
  fleet: {
    count: "",
    profile: "",
    multi_region: null,
  },
  stages: ["planning", "documents", "report"],
  kind: "",
  useSto: null,
  stoName: "",
  elements: [],
  timing: "this_quarter",
  timingStart: "",
  timingEnd: "",
  budget: "custom",
  price: "",
  negotiation: "yes",
  customerType: "legal",
  company: EMPTY_BLITZ_COMPANY,
  comment: "",
  step: 0,
  isSubmitting: false,
};

/** Черновик заявки на аудит: при одном ОПО в списке остаётся только первый. */
export function createBlitzAuditReducer(
  state: CreateBlitzAuditState,
  action: CreateBlitzAuditAction,
): CreateBlitzAuditState {
  switch (action.type) {
    case "applicant/change":
      return {
        ...state,
        applicant: { ...state.applicant, [action.field]: action.value },
      };
    case "applicant/proxy":
      return {
        ...state,
        applicant: { ...state.applicant, by_proxy: action.byProxy },
      };
    case "scope/change":
      return {
        ...state,
        scope: action.scope,
        objects: action.scope === "one" ? state.objects.slice(0, 1) : state.objects,
      };
    case "object/change":
      return {
        ...state,
        objects: state.objects.map((item, index) => (
          index === action.index ? { ...item, [action.field]: action.value } : item
        )),
      };
    case "object/signs":
      return {
        ...state,
        objects: state.objects.map((item, index) => (
          index === action.index ? { ...item, hazard_signs: action.signs } : item
        )),
      };
    case "object/add":
      return {
        ...state,
        objects: [...state.objects, EMPTY_OBJECT],
      };
    case "object/remove":
      return {
        ...state,
        objects: state.objects.filter((item, index) => index !== action.index),
      };
    case "fleet/change":
      return {
        ...state,
        fleet: { ...state.fleet, [action.field]: action.value },
      };
    case "fleet/multi-region":
      return {
        ...state,
        fleet: { ...state.fleet, multi_region: action.multiRegion },
      };
    case "field/change":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "stages/change":
      return {
        ...state,
        stages: action.stages,
      };
    case "kind/change":
      return {
        ...state,
        kind: action.kind,
      };
    case "sto/change":
      return {
        ...state,
        useSto: action.useSto,
      };
    case "elements/change":
      return {
        ...state,
        elements: action.elements,
      };
    case "timing/change":
      return {
        ...state,
        timing: action.timing,
      };
    case "budget/change":
      return {
        ...state,
        budget: action.budget,
      };
    case "negotiation/change":
      return {
        ...state,
        negotiation: action.negotiation,
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
    case "requisites/fill":
      return {
        ...state,
        customerType: action.requisites.customer_type === "entrepreneur" ? "entrepreneur" : "legal",
        company: action.requisites.company ?? state.company,
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
