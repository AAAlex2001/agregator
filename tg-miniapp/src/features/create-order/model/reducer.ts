import type { CreateOrderAction, CreateOrderState } from "./types";

export const initialState: CreateOrderState = {
  step: 1,
  busy: false,
  done: false,
  title: "",
  sum: "",
  startDate: "",
  deadline: "",
  responsesDeadline: "",
  requiresExpert: false,
  requiresLicense: false,
  types: [],
  opos: [],
  comment: "",
  files: { technical: null, contract: null, company: null },
  otherFiles: [],
  visibleExperts: [],
  notifyExperts: true,
};

export function reducer(state: CreateOrderState, action: CreateOrderAction): CreateOrderState {
  switch (action.type) {
    case "set":
      return { ...state, [action.key]: action.value };
    case "flag":
      return { ...state, [action.key]: action.value };
    case "types":
      return { ...state, types: action.value };
    case "opos":
      return { ...state, opos: action.value };
    case "file":
      return { ...state, files: { ...state.files, [action.key]: action.file } };
    case "addOther":
      return { ...state, otherFiles: [...state.otherFiles, ...action.files] };
    case "removeOther":
      return { ...state, otherFiles: state.otherFiles.filter((_, i) => i !== action.index) };
    case "addExpert":
      return state.visibleExperts.some((e) => e.id === action.expert.id)
        ? state
        : { ...state, visibleExperts: [...state.visibleExperts, action.expert] };
    case "removeExpert":
      return { ...state, visibleExperts: state.visibleExperts.filter((e) => e.id !== action.id) };
    case "notifyExperts":
      return { ...state, notifyExperts: action.value };
    case "step":
      return { ...state, step: action.value };
    case "busy":
      return { ...state, busy: action.value };
    case "done":
      return { ...state, done: true };
    case "reset":
      return initialState;
  }
}
