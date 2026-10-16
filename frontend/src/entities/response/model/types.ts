/** Ставка НДС, которую API сохраняет в предложении исполнителя. */
export type VatKind = "NONE" | "VAT_5" | "VAT_7" | "VAT_22";

/** Реквизиты выбранной организации для заключения договора по отклику. */
export interface ResponseCompany {
  value: string;
  data: {
    inn?: string | null;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/** Предложение исполнителя и файлы для создания отклика через API. */
export interface RespondRequest {
  comment: string;
  proposed_sum_amount: number;
  proposed_start_date: string;
  proposed_deadline: string;
  vat_kind: VatKind;
  expert_inn: string;
  expert_company_data: ResponseCompany | null;
  files: File[];
}

/** Изменённое предложение: условия, сохраняемые прежние файлы и новые вложения. */
export interface UpdateResponseRequest {
  comment: string;
  proposed_sum_amount: number;
  proposed_start_date: string;
  proposed_deadline: string;
  vat_kind: VatKind;
  keep_files: string[];
  files: File[];
}

/** Стоимость предложения до налога, начисленный НДС и итоговая сумма. */
export interface VatBreakdown {
  base: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

/** Статус отклика: рассмотрение, переговоры, работа, завершение или отказ. */
export type ResponseStatus =
  | "REVIEW"
  | "REJECTED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "WITHDRAWN_BY_EXPERT";

/** Кто смотрит отклик: исполнитель видит свои предложения, заказчик — чужие. */
export type ResponseViewer = "EXPERT" | "CUSTOMER";

/** Документы заказа, сгруппированные по назначению. */
export interface ResponseOrderDocuments {
  technical: string[];
  contract: string[];
  company: string[];
  other: string[];
}

/** Требование заказа к исполнителю с цветом, полученным от сервера. */
export interface ResponseOrderBadge {
  text: string;
  variant: string;
}

/** Отклик в списке: предложение исполнителя, условия заказа и их прежние редакции. */
export interface ResponseItem {
  id: number;
  order_id: number;
  expert_id: number;
  order_public_id: string;
  order_customer_id: number;
  status: ResponseStatus;
  date: string;
  comment: string;
  proposed_sum: string;
  proposed_start_date: string;
  proposed_deadline: string;
  order_title: string;
  order_sum: string;
  order_start_date: string;
  order_date: string;
  order_comment: string;
  customer_name: string;
  customer_company: string;
  customer_inn: string;
  order_documents: ResponseOrderDocuments;
  response_files: string[];
  badges: ResponseOrderBadge[];
  created_at: string;
  proposed_sum_amount_raw: number;
  proposed_start_date_raw: string;
  proposed_deadline_raw: string;
  previous_comment: string | null;
  previous_proposed_sum: string | null;
  previous_proposed_start_date: string | null;
  previous_proposed_deadline: string | null;
  previous_vat_kind: VatKind | null;
  previous_response_files: string[] | null;
  order_previous_title: string | null;
  order_previous_comment: string | null;
  order_previous_sum: string | null;
  order_previous_badges: ResponseOrderBadge[] | null;
  expert_name: string;
  expert_avatar_url: string | null;
  expert_rating: number | null;
  expert_review_count: number;
  expert_public_id: string;
  confirm_deadline: string;
  expert_confirmed: boolean;
  has_review: boolean;
  rejection_reason: string | null;
  expert_company_name: string;
  expert_inn: string | null;
  vat_kind: VatKind;
  order_locked: boolean;
}

/** Вкладка списка откликов: фильтр по статусу. */
export type ResponseTab =
  | "all"
  | "review"
  | "in_progress"
  | "rejected"
  | "accepted"
  | "withdrawn_by_expert";

/** Количество откликов в каждой вкладке. */
export interface ResponseCounters {
  all: number;
  review: number;
  in_progress: number;
  rejected: number;
  accepted: number;
  withdrawn_by_expert: number;
}

/** Страница откликов, наличие следующей и счётчики вкладок. */
export interface ResponseListPage {
  items: ResponseItem[];
  has_more: boolean;
  counters: ResponseCounters;
}

/** Поля, по которым заказчик сортирует отклики. */
export type ResponseSortField = "created_at" | "proposed_sum_amount" | "expert_rating";

/** Направление сортировки: от меньшего к большему либо наоборот. */
export type ResponseSortDirection = "asc" | "desc";

/** Сортировка по одному полю или порядок сервера. */
export type ResponseSort =
  | { field: null; direction: null }
  | { field: ResponseSortField; direction: ResponseSortDirection };

/** Вкладка и порядок списка; новый объект запроса загружает список заново. */
export interface ResponseQuery {
  tab: ResponseTab;
  sort: ResponseSort;
}

/** Загруженные отклики, состояние запросов и догрузка следующей страницы. */
export interface ResponsesResult {
  items: ResponseItem[];
  counters: ResponseCounters;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
}

/** Подпись и цвета значка статуса в карточке отклика. */
export interface ResponseStatusBadge {
  text: string;
  color: string;
  background: string;
}
