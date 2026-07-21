import type {
  ContactDealDetail,
  ContactDealListItem,
  ExpertContactCardData,
  ExpertContactOfferData,
} from "@/source/entities/expert-contact";
import type { ExpertContactsState } from "./types";

export type ExpertContactsAction =
  | { type: "EXPERTS"; value: ExpertContactCardData[] }
  | { type: "DEALS"; value: ContactDealListItem[] }
  | { type: "OFFER"; value: ExpertContactOfferData | null }
  | { type: "SELECT_DEAL"; value: ContactDealDetail | null }
  | { type: "SEARCH"; value: string }
  | { type: "LOADING"; value: boolean }
  | { type: "BUSY"; value: boolean }
  | { type: "ERROR"; value: string | null };

export const initialExpertContactsState: ExpertContactsState = {
  experts: [],
  deals: [],
  offer: null,
  selectedDeal: null,
  search: "",
  loading: true,
  busy: false,
  error: null,
};

export function expertContactsReducer(
  state: ExpertContactsState,
  action: ExpertContactsAction,
): ExpertContactsState {
  switch (action.type) {
    case "EXPERTS":
      return { ...state, experts: action.value };
    case "DEALS":
      return { ...state, deals: action.value };
    case "OFFER":
      return { ...state, offer: action.value };
    case "SELECT_DEAL":
      return { ...state, selectedDeal: action.value };
    case "SEARCH":
      return { ...state, search: action.value };
    case "LOADING":
      return { ...state, loading: action.value };
    case "BUSY":
      return { ...state, busy: action.value };
    case "ERROR":
      return { ...state, error: action.value };
    default:
      return state;
  }
}
