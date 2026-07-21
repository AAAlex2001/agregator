import type {
  ContactDealDetail,
  ContactDealListItem,
  ExpertContactCardData,
  ExpertContactOfferData,
} from "@/source/entities/expert-contact";

export interface ExpertContactsState {
  experts: ExpertContactCardData[];
  deals: ContactDealListItem[];
  offer: ExpertContactOfferData | null;
  selectedDeal: ContactDealDetail | null;
  search: string;
  loading: boolean;
  busy: boolean;
  error: string | null;
}
