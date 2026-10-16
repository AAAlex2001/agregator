/** Документы заказа, сгруппированные по назначению. */
export interface OrderDocuments {
  technical: string[];
  contract: string[];
  company: string[];
  other: string[];
}

/** Требование к исполнителю с цветом, полученным от сервера. */
export interface OrderBadge {
  text: string;
  variant: string;
}

/** Условия заказа, доступные по публичной ссылке без авторизации. */
export interface PublicOrder {
  id: number;
  public_id: string;
  title: string;
  company: string;
  comment: string;
  start_date: string;
  date: string;
  sum: string;
  responses_deadline: string | null;
  badges: OrderBadge[];
  documents: OrderDocuments;
}

/** Подпись и готовое значение одной строки условий заказа. */
export interface OrderDetailRow {
  label: string;
  value: string | number | boolean | null | undefined;
  wide?: boolean;
}

/** Именованный раздел условий заказа со списком строк. */
export interface OrderDetailSection {
  title: string;
  rows: OrderDetailRow[];
}
