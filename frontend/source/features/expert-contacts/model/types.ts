import type {
  ContactDealDetail,
  ContactDealListItem,
  ExpertContactCardData,
  ExpertContactOfferData,
} from "@/source/entities/expert-contact";
import type { SortDir } from "@/source/shared/ui/SortPills";

export type ContactAccessFilter = "ALL" | "OPEN" | "CLOSED";

export interface ExpertContactsState {
  experts: ExpertContactCardData[];
  deals: ContactDealListItem[];
  offer: ExpertContactOfferData | null;
  selectedDeal: ContactDealDetail | null;
  reviewDeal: ContactDealDetail | null;
  deleteDeal: ContactDealListItem | null;
  search: string;
  accessFilter: ContactAccessFilter;
  ratingSort: SortDir | null;
  loading: boolean;
  busy: boolean;
  error: string | null;
}
