/** Вид объявления: организация ищет исполнителя или исполнитель готов к трудоустройству. */
export type LaborListingKind = "EXPERT_WANTED" | "EXPERT_AVAILABLE";

/** Постоянная работа или срочный трудовой договор. */
export type EmploymentTerm = "PERMANENT" | "FIXED";

/** Основное место работы или совместительство. */
export type EmploymentType = "PRIMARY" | "PART_TIME";

/** Есть ли у исполнителя основное место работы сейчас. */
export type CurrentJobStatus = "NONE" | "EMPLOYED";

/** Удостоверение или требование к аттестации исполнителя. */
export interface LaborCertificate {
  area: string | null;
  object: string | null;
  category: string | null;
  expires_at?: string | null;
}

/** Пользователь, откликнувшийся на объявление, и его чат с автором. */
export interface LaborResponder {
  user_id: number;
  public_id: string;
  name: string;
  avatar_url: string | null;
  role: "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";
  responded_at: string;
  chat_uuid: string;
}

/** Объявление трудовых ресурсов в ответе API. */
export interface LaborListing {
  id: number;
  public_id: string;
  owner_id: number;
  owner_name: string;
  owner_avatar_url: string | null;
  kind: LaborListingKind;
  certificates: LaborCertificate[];
  other_profession: string | null;
  region: string;
  employment_term: EmploymentTerm;
  fixed_term: string | null;
  start_date: string | null;
  employment_type: EmploymentType | null;
  current_job_status: CurrentJobStatus | null;
  is_active: boolean;
  is_mine: boolean;
  created_at: string;
  responders: LaborResponder[];
}

/** Данные нового объявления для API. */
export interface LaborListingRequest {
  kind: LaborListingKind;
  certificates: LaborCertificate[];
  other_profession: string | null;
  region: string;
  employment_term: EmploymentTerm;
  fixed_term: string | null;
  start_date: string | null;
  employment_type: EmploymentType | null;
  current_job_status: CurrentJobStatus | null;
}
