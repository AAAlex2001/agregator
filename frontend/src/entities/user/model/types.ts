/** Роль аккаунта в API; один адрес почты может принадлежать нескольким ролям. */
export type UserRole = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";

/** Данные формы входа; role уточняется, когда API предлагает несколько аккаунтов. */
export interface LoginCredentials {
  email: string;
  password: string;
  role?: UserRole;
}

/** Краткий результат входа; полный профиль загружается отдельным запросом. */
export interface LoginResponse {
  id: number;
  role: UserRole;
  inn: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
}

/** Другой аккаунт на ту же почту; переключение доступно после подтверждения адреса. */
export interface AvailableRole {
  role: UserRole;
  email_verified: boolean;
}

/** Настройки отправки писем по событиям заказов, общения и публикаций. */
export interface EmailPreferences {
  email_on_response_created: boolean;
  email_on_response_updated: boolean;
  email_on_expert_rejected: boolean;
  email_on_order_updated: boolean;
  email_on_bidding_finished: boolean;
  email_on_chat_message: boolean;
  email_on_question_asked: boolean;
  email_on_question_answered: boolean;
  email_on_new_blog_post: boolean;
  email_on_labor_listing: boolean;
}

/** Сведения об организации из API подсказок, сохранённые в профиле без потери полей. */
export interface CompanyData {
  value?: string;
  unrestricted_value?: string;
  data?: {
    inn?: string | null;
    name?: {
      full_with_opf?: string | null;
      short_with_opf?: string | null;
    } | null;
    [field: string]: unknown;
  };
  [field: string]: unknown;
}

/** Рейтинг исполнителя, местоположение и выбранные сведения для публичной карты. */
export interface ExpertProfileData {
  rating: number | null;
  review_count: number;
  location_lat: number | null;
  location_lng: number | null;
  location_address: string | null;
  location_city: string | null;
  travels_to_other_regions: boolean;
  show_on_map: boolean;
  map_fields: string[];
}

/** Разрешительные документы и условия аренды, включённые в ответ профиля пользователя. */
export interface LicenseHolderProfileData {
  license_number: string | null;
  license_file_url: string | null;
  license_areas: string[] | null;
  license_rental_kind: "PERCENT" | "FIXED" | "NEGOTIABLE" | null;
  license_rental_percent: number | null;
  license_rental_fixed_amount: number | null;
  mining_license_number: string | null;
  mining_license_file_url: string | null;
  sro_design_file_url: string | null;
  sro_survey_file_url: string | null;
  lab_accreditation_number: string | null;
  lab_accreditation_file_url: string | null;
  company_card_url: string | null;
}

/** Полный ответ /settings/profile для текущего аккаунта, включая данные его роли. */
export interface UserProfile {
  id: number;
  role: UserRole;
  email: string | null;
  email_verified: boolean;
  phone: string | null;
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
  inn: string | null;
  company_data: CompanyData | null;
  email_preferences: EmailPreferences;
  notify_order_types: string[];
  directions: string[];
  notifications_introduced: boolean;
  expert: ExpertProfileData | null;
  license_holder: LicenseHolderProfileData | null;
}

/** Подтверждённый профиль и состояние его загрузки, общие для приложения. */
export interface UserState {
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  error: string | null;
}

/** События загрузки профиля и изменения действующего аккаунта. */
export type UserAction =
  | { type: "profile/loading" }
  | { type: "profile/loaded"; user: UserProfile | null }
  | { type: "profile/updated"; user: UserProfile }
  | { type: "profile/failed"; error: string }
  | { type: "account/authenticated"; role: UserRole }
  | { type: "user/changed"; user: UserProfile | null };

/** Имя, фамилия и телефон, отправляемые при сохранении персональных данных. */
export interface UpdateUserProfile {
  first_name: string;
  last_name: string;
  phone?: string;
}

/** Место базирования исполнителя и сведения его анкеты для публичной карты. */
export interface UpdateExpertLocation {
  location_lat: number | null;
  location_lng: number | null;
  location_address: string | null;
  location_city: string | null;
  travels_to_other_regions: boolean;
  show_on_map: boolean;
  map_fields: string[];
}

/** Условия предоставления лицензии и номера дополнительных документов для API. */
export interface UpdateLicenseTerms {
  license_number: string;
  license_areas: string[];
  license_rental_kind: "PERCENT" | "FIXED" | "NEGOTIABLE";
  license_rental_percent?: number;
  license_rental_fixed_amount?: number;
  mining_license_number: string | null;
  lab_accreditation_number: string | null;
}

/** Документ держателя лицензии, который загружается отдельно от условий. */
export type LicenseDocumentKind =
  | "license"
  | "companyCard"
  | "miningLicense"
  | "sroDesign"
  | "sroSurvey"
  | "labAccreditation";
