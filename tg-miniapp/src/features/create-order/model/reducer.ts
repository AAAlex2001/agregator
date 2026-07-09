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
  copySourceOrderId: null,
  copiedDocuments: { technical: [], contract: [], company: [], other: [] },
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
    case "copy":
      return { ...initialState, ...action, copySourceOrderId: action.sourceOrderId, copiedDocuments: action.documents };
    case "removeCopied":
      return {
        ...state,
        copiedDocuments: {
          technical: state.copiedDocuments.technical.filter((url) => url !== action.url),
          contract: state.copiedDocuments.contract.filter((url) => url !== action.url),
          company: state.copiedDocuments.company.filter((url) => url !== action.url),
          other: state.copiedDocuments.other.filter((url) => url !== action.url),
        },
      };
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
