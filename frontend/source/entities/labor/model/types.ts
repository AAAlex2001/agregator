export type LaborListingKind = "EXPERT_WANTED" | "EXPERT_AVAILABLE";
export type EmploymentTerm = "PERMANENT" | "FIXED";
export type EmploymentType = "PRIMARY" | "PART_TIME";
export type CurrentJobStatus = "NONE" | "EMPLOYED";

export interface LaborCertificate {
  area: string;
  object?: string;
  category?: string;
  expires_at?: string;
}

export interface LaborListingData {
  id: number;
  public_id: string;
  owner_id: number;
  owner_name: string;
  owner_avatar_url: string | null;
  kind: LaborListingKind;
  certificates: LaborCertificate[];
  region: string;
  employment_term: EmploymentTerm;
  fixed_term: string | null;
  start_date: string | null;
  employment_type: EmploymentType | null;
  current_job_status: CurrentJobStatus | null;
  is_active: boolean;
  is_mine: boolean;
  created_at: string;
}

export interface LaborListingPayload {
  kind: LaborListingKind;
  certificates: LaborCertificate[];
  region: string;
  employment_term: EmploymentTerm;
  fixed_term?: string | null;
  start_date?: string | null;
  employment_type?: EmploymentType | null;
  current_job_status?: CurrentJobStatus | null;
}
