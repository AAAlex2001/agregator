/** Поле анкеты, которое специалист может разрешить показывать на публичной карте. */
export interface ExpertMapFieldOption {
  value: string;
  label: string;
}

/** Настройки видимости полей одного профессионального направления. */
export interface ExpertMapFieldGroup {
  direction: string;
  title: string;
  options: ExpertMapFieldOption[];
}

/** Исполнитель на карте с разрешёнными им сведениями и кодами для фильтрации. */
export interface ExpertMapItem {
  public_id: string;
  full_name: string;
  avatar_url: string | null;
  rating: number | null;
  city: string | null;
  lat: number;
  lng: number;
  travels_to_other_regions: boolean;
  certificates: string[] | null;
  certificate_codes: string[];
  phone: string | null;
  email: string | null;
  contacts_paid: boolean;
  contact_price_rubles: number | null;
}

/** Ответ API со всеми исполнителями выбранного направления на карте. */
export interface ExpertsMapResponse {
  items: ExpertMapItem[];
}

/** Документы последнего заказа исполнителя по группам назначения. */
export interface ExpertLastOrderDocuments {
  technical: string[];
  contract: string[];
  company: string[];
  other: string[];
}

/** Последний выполненный заказ исполнителя и принятое предложение по нему. */
export interface ExpertLastOrder {
  id: number;
  title: string;
  company: string;
  customer_name: string;
  customer_inn: string;
  sum: string;
  start_date: string;
  date: string;
  documents: ExpertLastOrderDocuments;
  executor_comment: string;
  executor_files: string[];
  executor_proposed_sum: string;
  executor_proposed_start_date: string;
  executor_proposed_deadline: string;
}

/** Карточка исполнителя в рейтинге: репутация, стаж и последний заказ. */
export interface ExpertSummary {
  public_id: string;
  full_name: string;
  avatar_url: string | null;
  rating: number | null;
  review_count: number;
  completed_orders_count: number;
  joined_at: string;
  last_order: ExpertLastOrder | null;
}

/** Страница рейтинга исполнителей. */
export interface ExpertSummaryPage {
  items: ExpertSummary[];
  has_more: boolean;
}

/** Поле сортировки рейтинга исполнителей. */
export type ExpertSortField = "rating" | "completed_orders" | "review_count";

/** Выбранное поле и направление сортировки; null возвращает порядок сервера. */
export interface ExpertSort {
  field: ExpertSortField | null;
  direction: "asc" | "desc" | null;
}
