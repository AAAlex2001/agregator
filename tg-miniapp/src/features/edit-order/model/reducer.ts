import type { EditOrderAction, EditOrderState } from "./types";

export const initialState: EditOrderState = {
  title: "",
  sum: "",
  startDate: "",
  deadline: "",
  responsesDeadline: "",
  comment: "",
  keepDocuments: { technical: [], contract: [], company: [], other: [] },
  newFiles: [],
  notifyResponders: true,
  busy: false,
};

export function reducer(state: EditOrderState, action: EditOrderAction): EditOrderState {
  switch (action.type) {
    case "prefill":
      return { ...initialState, ...action.payload };
    case "set":
      return { ...state, [action.key]: action.value };
    case "removeKeep":
      return {
        ...state,
        keepDocuments: {
          technical: state.keepDocuments.technical.filter((u) => u !== action.url),
          contract: state.keepDocuments.contract.filter((u) => u !== action.url),
          company: state.keepDocuments.company.filter((u) => u !== action.url),
          other: state.keepDocuments.other.filter((u) => u !== action.url),
        },
      };
    case "addFiles":
      return { ...state, newFiles: [...state.newFiles, ...action.files] };
    case "removeNew":
      return { ...state, newFiles: state.newFiles.filter((_, i) => i !== action.index) };
    case "notifyResponders":
      return { ...state, notifyResponders: action.value };
    case "busy":
      return { ...state, busy: action.value };
  }
}
