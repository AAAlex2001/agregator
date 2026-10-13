import type { LeadFormAction, LeadFormState } from "./types";

/** Пустая форма; направление берётся у статьи, с которой открыта форма. */
export function initialLeadForm(direction: string): LeadFormState {
  return {
    fields: {
      direction,
      name: "",
      phone: "",
      email: "",
      company: "",
      inn: "",
      region: "",
      workKinds: [],
      objectName: "",
      task: "",
      deadline: "",
      budget: "",
    },
    isSending: false,
    isSent: false,
  };
}

export function leadFormReducer(state: LeadFormState, action: LeadFormAction): LeadFormState {
  switch (action.type) {
    case "field/change":
      return { ...state, fields: { ...state.fields, [action.field]: action.value } };
    case "direction/change":
      return { ...state, fields: { ...state.fields, direction: action.direction, workKinds: [] } };
    case "kinds/change":
      return { ...state, fields: { ...state.fields, workKinds: action.workKinds } };
    case "submit/start":
      return { ...state, isSending: true };
    case "submit/success":
      return { ...state, isSending: false, isSent: true };
    case "submit/error":
      return { ...state, isSending: false };
  }
}
