import type {
  CurrentJobStatus,
  EmploymentTerm,
  EmploymentType,
  LaborListingData,
  LaborListingKind,
} from "@/source/entities/labor";

export type LaborPageMode = "license" | "expert";
export type LaborListTab = "browse" | "mine";

export interface LaborPageCopy {
  title: string;
  subtitle: string;
  browseTab: string;
  ownKind: LaborListingKind;
  browseKind: LaborListingKind;
  formTitle: string;
}

export interface LaborFormState {
  areas: string[];
  category: string;
  region: string;
  term: EmploymentTerm;
  fixedTerm: string;
  startDate: string;
  employmentType: EmploymentType;
  jobStatus: CurrentJobStatus;
  submitting: boolean;
  error: string | null;
}

export interface LaborResourcesState {
  tab: LaborListTab;
  items: LaborListingData[];
  loading: boolean;
  error: string | null;
  busyId: number | null;
  formOpen: boolean;
  isDesktop: boolean;
  reloadKey: number;
}
