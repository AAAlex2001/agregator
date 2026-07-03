import type { RespondAction, RespondState } from "./types";

export const initialState: RespondState = {
  startDate: "",
  deadline: "",
  sum: "",
  vat: "NONE",
  comment: "",
  companyName: "",
  party: null,
  files: [],
  busy: false,
  done: false,
};

export function reducer(state: RespondState, action: RespondAction): RespondState {
  switch (action.type) {
    case "reset":
      return initialState;
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
    case "companyText":
      return { ...state, companyName: action.value, party: null };
    case "companyPick":
      return { ...state, companyName: action.party.value, party: action.party };
    case "addFiles":
      return { ...state, files: [...state.files, ...action.files] };
    case "removeFile":
      return { ...state, files: state.files.filter((_, i) => i !== action.index) };
    case "busy":
      return { ...state, busy: action.value };
    case "done":
      return { ...state, busy: false, done: true };
  }
}
