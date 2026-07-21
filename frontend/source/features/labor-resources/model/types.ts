import type {
  CurrentJobStatus,
  EmploymentTerm,
  EmploymentType,
  LaborListingData,
  LaborListingKind,
} from "@/source/entities/labor";
import type { ExpertiseType } from "@/source/entities/expertise";

export type LaborPageMode = "license" | "expert";
export type LaborListTab = "browse" | "mine";
export type LaborExpertiseMode = "EXACT" | "GENERAL";

export interface LaborPageCopy {
  title: string;
  subtitle: string;
  browseTab: string;
  ownKind: LaborListingKind;
  browseKind: LaborListingKind;
  formTitle: string;
}

export interface LaborFormState {
  expertiseMode: LaborExpertiseMode;
  certificateCodes: string[];
  expertiseTypes: ExpertiseType[];
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
