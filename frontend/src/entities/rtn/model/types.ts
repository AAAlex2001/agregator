/** Вид опубликованного документа Ростехнадзора. */
export type RtnDocumentType =
  | "OFFICIAL_CLARIFICATION"
  | "INFO_LETTER"
  | "RESPONSE_TO_REQUEST";

/** Действует ли опубликованное разъяснение. */
export type RtnStatus = "ACTIVE" | "EXPIRED";

/** Загруженный документ обращения или ответа Ростехнадзора. */
export interface RtnFile {
  name: string;
  url: string;
}

/** Значение и подпись одного пункта справочника РТН. */
export interface RtnOption {
  value: string;
  label: string;
}

/** Справочники API для фильтров и классификации разъяснений. */
export interface RtnTaxonomy {
  document_types: RtnOption[];
  statuses: RtnOption[];
  oversight_areas: RtnOption[];
  industries: RtnOption[];
  activities: RtnOption[];
  object_types: RtnOption[];
}

/** Разъяснение в каталоге: описание, реквизиты письма и документы. */
export interface RtnListItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  document_type: RtnDocumentType;
  status: RtnStatus;
  letter_number: string;
  department: string;
  source_url: string;
  request_files: RtnFile[];
  response_files: RtnFile[];
  tags: string[];
  published_at: string | null;
}

/** Загруженная часть каталога и признак наличия следующих записей. */
export interface RtnList {
  items: RtnListItem[];
  has_more: boolean;
}

/** Фильтры из адреса каталога и границы запрашиваемого списка. */
export interface RtnListQuery {
  filters: string;
  limit: number;
  offset: number;
}

/** Ссылка на нормативный документ, упомянутый в разъяснении. */
export interface RtnRegulationLink {
  label: string;
  url: string;
}

/** Полное разъяснение с ответом, классификацией и поисковыми метаданными. */
export interface RtnDetail extends RtnListItem {
  question_text: string;
  answer_html: string;
  referenced_regulations: RtnRegulationLink[];
  oversight_areas: RtnOption[];
  industries: RtnOption[];
  activities: RtnOption[];
  object_types: RtnOption[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  updated_at: string;
  views_count: number;
  likes_count: number;
  dislikes_count: number;
}

/** Загруженные вложения комментария или ответа и действия с ними. */
export interface RtnAttachments {
  files: RtnFile[];
  isUploading: boolean;
  add: (file: File) => Promise<void>;
  remove: (url: string) => void;
  clear: () => void;
}

/** Оценка полезности разъяснения Ростехнадзора. */
export type RtnReaction = "LIKE" | "DISLIKE";

/** Счётчики разъяснения и оценка текущего посетителя. */
export interface RtnReactions {
  likes_count: number;
  dislikes_count: number;
  views_count: number;
  my_reaction: RtnReaction | null;
}

/** Отметка участника профессионального обсуждения под разъяснением. */
export type RtnCommentReaction = "USEFUL" | "CLARIFICATION" | "AGREE";

/** Счётчики отметок и реакция текущего участника обсуждения. */
export interface RtnCommentCounters {
  useful_count: number;
  clarification_count: number;
  agree_count: number;
  my_reaction: RtnCommentReaction | null;
}

/** Комментарий или ответ с автором, вложениями и признаком принадлежности. */
export interface RtnComment extends RtnCommentCounters {
  id: number;
  parent_id: number | null;
  text: string;
  author: {
    name: string;
    is_expert: boolean;
  };
  attachments: RtnFile[];
  created_at: string;
  is_mine: boolean;
}

/** Ответ API со всеми комментариями и вложенными ответами разъяснения. */
export interface RtnCommentsResponse {
  items: RtnComment[];
}

/** Поля профессионального обсуждения, по которым можно упорядочить комментарии. */
export type RtnCommentSortField = "useful_count" | "created_at" | "is_expert";

/** Выбранный порядок комментариев; null сохраняет исходный порядок API. */
export interface RtnCommentSort {
  by: RtnCommentSortField | null;
  dir: "asc" | "desc" | null;
}

/** Этап рассмотрения обращения в Ростехнадзор. */
export type RtnQuestionStatus = "NEW" | "IN_REVIEW" | "PUBLISHED" | "DISMISSED";

/** Собственное обращение с состоянием рассмотрения и ссылкой на официальный ответ. */
export interface RtnQuestion {
  id: number;
  question_text: string;
  contact_email: string;
  status: RtnQuestionStatus;
  dismiss_reason: string;
  answer_title: string | null;
  answer_slug: string | null;
  created_at: string;
}

/** Публичное обращение, уже принятое в работу или получившее официальный ответ. */
export interface PublicRtnQuestion {
  id: number;
  question_text: string;
  status: RtnQuestionStatus;
  answer_slug: string | null;
  replies_count: number;
  created_at: string;
}

/** Ответ ведомства с документами, которым поделился участник обсуждения. */
export interface RtnQuestionReply {
  id: number;
  text: string;
  attachments: RtnFile[];
  author_name: string;
  created_at: string;
}
