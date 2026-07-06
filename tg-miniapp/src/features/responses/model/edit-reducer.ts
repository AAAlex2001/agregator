import type { EditResponseAction, EditResponseState } from "./edit-types";

export const initialState: EditResponseState = {
  startDate: "",
  deadline: "",
  sum: "",
  vat: "NONE",
  comment: "",
  keepFiles: [],
  newFiles: [],
  busy: false,
};

export function reducer(state: EditResponseState, action: EditResponseAction): EditResponseState {
  switch (action.type) {
    case "prefill":
      return { ...initialState, ...action.payload };
    case "startDate":
      return { ...state, startDate: action.value };
    case "deadline":
      return { ...state, deadline: action.value };
    case "sum":
      return { ...state, sum: action.value };
    case "vat":
      return { ...state, vat: action.value };
    case "comment":
      return { ...state, comment: action.value };
    case "removeKeep":
      return { ...state, keepFiles: state.keepFiles.filter((u) => u !== action.url) };
    case "addFiles":
      return { ...state, newFiles: [...state.newFiles, ...action.files] };
    case "removeNew":
      return { ...state, newFiles: state.newFiles.filter((_, i) => i !== action.index) };
    case "busy":
      return { ...state, busy: action.value };
  }
}
