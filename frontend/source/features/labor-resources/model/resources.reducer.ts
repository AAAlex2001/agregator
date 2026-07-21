import type { LaborListingData } from "@/source/entities/labor";
import type {
  LaborListTab,
  LaborResourcesState,
} from "./types";

export type LaborResourcesAction =
  | { type: "TAB"; value: LaborListTab }
  | { type: "LOADING"; value: boolean }
  | { type: "DATA"; items: LaborListingData[] }
  | { type: "ERROR"; value: string | null }
  | { type: "BUSY"; id: number | null }
  | { type: "FORM_OPEN"; value: boolean }
  | { type: "DESKTOP"; value: boolean }
  | { type: "RELOAD" };

export const initialLaborResourcesState: LaborResourcesState = {
  tab: "browse",
  items: [],
  loading: true,
  error: null,
  busyId: null,
  formOpen: false,
  isDesktop: false,
  reloadKey: 0,
};

export function laborResourcesReducer(
  state: LaborResourcesState,
  action: LaborResourcesAction,
): LaborResourcesState {
  switch (action.type) {
    case "TAB":
      return { ...state, tab: action.value };
    case "LOADING":
      return { ...state, loading: action.value };
    case "DATA":
      return { ...state, items: action.items };
    case "ERROR":
      return { ...state, error: action.value };
    case "BUSY":
      return { ...state, busyId: action.id };
    case "FORM_OPEN":
      return { ...state, formOpen: action.value };
    case "DESKTOP":
      return { ...state, isDesktop: action.value };
    case "RELOAD":
      return { ...state, reloadKey: state.reloadKey + 1 };
    default:
      return state;
  }
}
