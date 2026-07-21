import type {
  ContactDealDetail,
  ContactDealListItem,
  ExpertContactCardData,
  ExpertContactOfferData,
} from "@/source/entities/expert-contact";
import type { SortDir } from "@/source/shared/ui/SortPills";
import type { ContactAccessFilter, ExpertContactsState } from "./types";

export type ExpertContactsAction =
  | { type: "EXPERTS"; value: ExpertContactCardData[] }
  | { type: "DEALS"; value: ContactDealListItem[] }
  | { type: "OFFER"; value: ExpertContactOfferData | null }
  | { type: "SELECT_DEAL"; value: ContactDealDetail | null }
  | { type: "SYNC_DEAL"; value: ContactDealDetail }
  | { type: "SYNC_OFFER"; value: ExpertContactOfferData }
  | { type: "SEARCH"; value: string }
  | { type: "ACCESS_FILTER"; value: ContactAccessFilter }
  | { type: "RATING_SORT"; value: SortDir | null }
  | { type: "LOADING"; value: boolean }
  | { type: "BUSY"; value: boolean }
  | { type: "ERROR"; value: string | null };

export const initialExpertContactsState: ExpertContactsState = {
  experts: [],
  deals: [],
  offer: null,
  selectedDeal: null,
  search: "",
  accessFilter: "ALL",
  ratingSort: null,
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
    case "SYNC_DEAL":
      return {
        ...state,
        experts: state.experts.map((expert) => (
          expert.id === action.value.seller_id
            ? {
                ...expert,
                deal_id: action.value.id,
                deal_status: action.value.status,
                phone: action.value.seller_contacts?.phone ?? expert.phone,
                email: action.value.seller_contacts?.email ?? expert.email,
              }
            : expert
        )),
      };
    case "SYNC_OFFER":
      return {
        ...state,
        offer: action.value,
        experts: state.experts.map((expert) => (
          expert.is_mine
            ? {
                ...expert,
                sales_enabled: action.value.enabled,
                price_rubles: action.value.price_rubles,
              }
            : expert
        )),
      };
    case "SEARCH":
      return { ...state, search: action.value };
    case "ACCESS_FILTER":
      return { ...state, accessFilter: action.value };
    case "RATING_SORT":
      return { ...state, ratingSort: action.value };
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
