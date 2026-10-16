/** Вид подсказки поиска: строка, документ, номер, тип или ведомство. */
export type TechExpertTipType = "string" | "document" | "number" | "type" | "department";

/** Подсказка, которую можно подставить в строку поиска. */
export interface TechExpertTip {
  id: number | null;
  value: string;
  type: TechExpertTipType;
}

/** Найденный документ фонда «Кодекс» и уровень доступа к нему. */
export interface TechExpertDocument {
  id: number;
  name: string;
  status: string | null;
  doctype: string;
  number: string | null;
  date: string | null;
  department: string;
  access: string;
}

/** Найденные документы и их общее число. */
export interface TechExpertSearchResult {
  items: TechExpertDocument[];
  total: number;
}

/** Карточка документа: реквизиты, даты редакций, наличие текста и публикации. */
export interface TechExpertDocumentCard extends TechExpertDocument {
  access_reason: string | null;
  is_important: boolean;
  is_favorite: boolean;
  is_purchased: boolean;
  price: number;
  edition_date: string | null;
  change_date: string | null;
  action_start_date: string | null;
  action_end_date: string | null;
  certificate_number: string | null;
  certificate_date: string | null;
  mu_number: string | null;
  mu_date: string | null;
  in_product_created: string | null;
  in_product_updated: string | null;
  has_text: boolean;
  has_pdf: boolean;
  has_scan: boolean;
  has_html: boolean;
  has_attachments: boolean;
  blocks: number;
  publications: string[];
}

/** Фрагмент текста документа в HTML. */
export interface TechExpertDocumentContent {
  content: string;
}
