import type { VatKind } from "@/source/entities/response";
import type { PartySuggestion } from "@/source/entities/party";

export const VAT_KIND_VALUES: VatKind[] = ["NONE", "VAT_5", "VAT_7", "VAT_22"];

export interface RespondFormState {
  startDate: string;
  deadline: string;
  cost: string;
  vatKind: VatKind;
  comment: string;
  companyName: string;
  companyData: PartySuggestion | null;
}

export type RespondFormAction =
  | { type: "set"; field: "startDate" | "deadline" | "comment"; value: string }
  | { type: "cost"; value: string }
  | { type: "vatKind"; value: VatKind }
  | { type: "company"; name: string; data: PartySuggestion | null }
  | { type: "reset"; state: RespondFormState };

export const emptyRespondForm: RespondFormState = {
  startDate: "",
  deadline: "",
  cost: "",
  vatKind: "NONE",
  comment: "",
  companyName: "",
  companyData: null,
};

export function respondFormReducer(state: RespondFormState, action: RespondFormAction): RespondFormState {
  switch (action.type) {
    case "set":
      return { ...state, [action.field]: action.value };
    case "cost":
      return { ...state, cost: action.value.replace(/[^0-9]/g, "") };
    case "vatKind":
      return { ...state, vatKind: action.value };
    case "company":
      return { ...state, companyName: action.name, companyData: action.data };
    case "reset":
      return action.state;
  }
}
