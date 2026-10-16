import type { LeadFormAction, LeadFormState } from "./types";

/** Открывает пустую заявку с направлением текущей статьи. */
export function createLeadFormState(direction: string): LeadFormState {
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

/** Меняет черновик и сохраняет введённые данные при ошибке отправки. */
export function leadFormReducer(
  state: LeadFormState,
  action: LeadFormAction,
): LeadFormState {
  switch (action.type) {
    case "field/changed":
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: action.value,
        },
      };
    case "direction/changed":
      return {
        ...state,
        fields: {
          ...state.fields,
          direction: action.direction,
          workKinds: [],
        },
      };
    case "kinds/changed":
      return {
        ...state,
        fields: {
          ...state.fields,
          workKinds: action.workKinds,
        },
      };
    case "submit/started":
      return {
        ...state,
        isSending: true,
      };
    case "submit/succeeded":
      return {
        ...state,
        isSending: false,
        isSent: true,
      };
    case "submit/failed":
      return {
        ...state,
        isSending: false,
      };
  }
}
