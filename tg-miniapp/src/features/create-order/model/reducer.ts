import type { ExpertiseType } from "@/entites/expertise";

export type StringField = "title" | "sum" | "startDate" | "deadline" | "responsesDeadline" | "comment";
export type FileKey = "technical" | "contract" | "company";
export type FlagKey = "requiresExpert" | "requiresLicense";

export interface CreateOrderState {
  step: number;
  busy: boolean;
  done: boolean;
  title: string;
  sum: string;
  startDate: string;
  deadline: string;
  responsesDeadline: string;
  requiresExpert: boolean;
  requiresLicense: boolean;
  types: ExpertiseType[];
  opos: string[];
  comment: string;
  files: Record<FileKey, File | null>;
  otherFiles: File[];
}

export type CreateOrderAction =
  | { type: "set"; key: StringField; value: string }
  | { type: "flag"; key: FlagKey; value: boolean }
  | { type: "types"; value: ExpertiseType[] }
  | { type: "opos"; value: string[] }
  | { type: "file"; key: FileKey; file: File | null }
  | { type: "addOther"; files: File[] }
  | { type: "removeOther"; index: number }
  | { type: "step"; value: number }
  | { type: "busy"; value: boolean }
  | { type: "done" }
  | { type: "reset" };

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
