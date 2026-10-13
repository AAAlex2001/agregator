import type { OfferAction, OfferState } from "./types";

export function offerReducer(state: OfferState, action: OfferAction): OfferState {
  switch (action.type) {
    case "field":
      return { ...state, [action.field]: action.value };
    case "cost":
      return { ...state, cost: action.value.replace(/\D/g, "") };
    case "vatKind":
      return { ...state, vatKind: action.value };
    case "company":
      return { ...state, companyName: action.name, company: action.company };
  }
}
