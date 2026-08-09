import type {
  ContactDealDetail,
  ContactDealListItem,
  ExpertContactCardData,
  ExpertContactOfferData,
} from "@/source/entities/expert-contact";
import type { SortDir } from "@/source/shared/ui/SortPills";
import type { ContactAccessFilter, ExpertContactsState } from "./types";

export type ExpertContactsAction =
  | { type: "LOAD_PENDING" }
  | {
      type: "LOAD_FULFILLED";
      experts: ExpertContactCardData[];
      deals: ContactDealListItem[];
      offer: ExpertContactOfferData | null;
    }
  | { type: "LOAD_REJECTED" }
  | { type: "EXPERTS"; value: ExpertContactCardData[] }
  | { type: "DEALS"; value: ContactDealListItem[] }
  | { type: "SELECT_DEAL"; value: ContactDealDetail | null }
  | { type: "REVIEW_DEAL"; value: ContactDealDetail | null }
  | { type: "DELETE_DEAL"; value: ContactDealListItem | null }
  | { type: "SYNC_DEAL"; value: ContactDealDetail }
  | { type: "SYNC_OFFER"; value: ExpertContactOfferData }
  | { type: "SEARCH"; value: string }
  | { type: "ACCESS_FILTER"; value: ContactAccessFilter }
  | { type: "RATING_SORT"; value: SortDir | null }
  | { type: "DEAL_CHAT"; value: string | null }
  | { type: "BUSY"; value: boolean };

export const initialExpertContactsState: ExpertContactsState = {
  experts: [],
  deals: [],
  offer: null,
  selectedDeal: null,
  reviewDeal: null,
  deleteDeal: null,
  search: "",
  accessFilter: "ALL",
  ratingSort: null,
  dealChatUuid: null,
  loading: true,
  busy: false,
};

export function expertContactsReducer(
  state: ExpertContactsState,
  action: ExpertContactsAction,
): ExpertContactsState {
  switch (action.type) {
    case "LOAD_PENDING":
      return { ...state, loading: true };
    case "LOAD_FULFILLED":
      return { ...state, loading: false, experts: action.experts, deals: action.deals, offer: action.offer };
    case "LOAD_REJECTED":
      return { ...state, loading: false };
    case "EXPERTS":
      return { ...state, experts: action.value };
    case "DEALS":
      return { ...state, deals: action.value };
    case "SELECT_DEAL":
      return { ...state, selectedDeal: action.value };
    case "REVIEW_DEAL":
      return { ...state, reviewDeal: action.value };
    case "DELETE_DEAL":
      return { ...state, deleteDeal: action.value };
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
    case "DEAL_CHAT":
      return { ...state, dealChatUuid: action.value };
    case "BUSY":
      return { ...state, busy: action.value };
  }
}
