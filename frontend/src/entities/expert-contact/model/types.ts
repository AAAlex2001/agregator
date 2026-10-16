/** Этап заключения договора, оплаты и открытия контактов. */
export type ContactDealStatus =
  | "AWAITING_BUYER_SIGNATURE"
  | "AWAITING_SELLER_SIGNATURE"
  | "AWAITING_PAYMENT"
  | "PAYMENT_REPORTED"
  | "PAYMENT_REJECTED"
  | "CONTACTS_RELEASED"
  | "CANCELED";

/** Сторона договора: исполнитель продаёт доступ, покупатель получает контакты. */
export type ContactDealParty = "SELLER" | "BUYER";

/** Удостоверение исполнителя в каталоге доступных контактов. */
export interface ContactCertificate {
  area?: string;
  object?: string;
  category?: string;
  expires_at?: string;
}

/** Исполнитель, условия доступа и доступные текущему покупателю контакты. */
export interface ExpertContact {
  id: number;
  public_id: string;
  name: string;
  avatar_url: string | null;
  city: string | null;
  certificates: ContactCertificate[];
  rating: number | null;
  review_count: number;
  masked_phone: string | null;
  masked_email: string | null;
  phone: string | null;
  email: string | null;
  sales_enabled: boolean;
  price_rubles: number | null;
  is_mine: boolean;
  deal_id: number | null;
  deal_status: ContactDealStatus | null;
}

/** Сохранённые реквизиты стороны договора с названиями полей из API. */
export interface ContractRequisites {
  [label: string]: string;
}

/** Снимок договора, содержание которого подтверждают электронные подписи. */
export interface ContactContract {
  version: string;
  title: string;
  number: string;
  date: string;
  seller_name: string;
  seller_area: string;
  buyer_name: string;
  price_rubles: number;
  preamble: string;
  clauses: string[];
  seller_requisites: ContractRequisites;
  buyer_requisites: ContractRequisites;
}

/** Результат проверки чека исполнителем либо замены новым файлом. */
export type ContactReceiptStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUPERSEDED";

/** Загруженный чек с результатом проверки и адресом скачивания. */
export interface ContactReceipt {
  id: number;
  public_id: string;
  original_name: string;
  content_type: string;
  size_bytes: number;
  sha256: string;
  status: ContactReceiptStatus;
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  download_url: string;
}

/** Краткие сведения о сделке для списка текущего пользователя. */
export interface ContactDealListItem {
  id: number;
  public_id: string;
  seller_id: number;
  status: ContactDealStatus;
  seller_name: string;
  buyer_name: string;
  price_rubles: number;
  actor_party: ContactDealParty | null;
  created_at: string;
  updated_at: string;
}

/** Электронная подпись конкретной версии договора. */
export interface ContactDealSignature {
  party: ContactDealParty;
  method: "PASSWORD" | "TELEGRAM";
  signer_name: string;
  document_hash: string;
  signed_at: string;
}

/** Контакты исполнителя после предоставления доступа покупателю. */
export interface ReleasedContacts {
  phone: string | null;
  email: string | null;
}

/** Полная сделка с договором, подписями, чеками и результатом оплаты. */
export interface ContactDeal extends ContactDealListItem {
  contract: ContactContract;
  contract_hash: string;
  signatures: ContactDealSignature[];
  receipts: ContactReceipt[];
  payment_details: string | null;
  seller_contacts: ReleasedContacts | null;
  buyer_reported_paid_at: string | null;
  seller_confirmed_at: string | null;
  released_at: string | null;
  released_by: "SELLER" | "ADMIN" | null;
  release_note: string | null;
  can_review: boolean;
  has_review: boolean;
}

/** Оценка и текст отзыва покупателя о завершённой сделке. */
export interface ContactDealReview {
  rating: number;
  comment: string;
}

/** Сохранённые условия платного доступа к контактам исполнителя. */
export interface ExpertContactOffer {
  enabled: boolean;
  price_rubles: number | null;
  has_payment_details: boolean;
  payment_details: string | null;
  consent_at: string | null;
}

/** Условия доступа, которые исполнитель подтверждает при сохранении. */
export interface UpdateContactOffer {
  enabled: boolean;
  price_rubles?: number;
  payment_details?: string;
  disclosure_consent?: boolean;
}

/** Редактируемые цена, реквизиты и согласие на передачу контактов. */
export interface ContactOfferFields {
  enabled: boolean;
  price: string;
  paymentDetails: string;
  consent: boolean;
}

/** Доступ к контактам, по которому отбирается каталог. */
export type ContactAccessFilter = "ALL" | "OPEN" | "CLOSED";

/** Поиск по ФИО, отбор по доступу и порядок по рейтингу. */
export interface ExpertContactsFilter {
  search: string;
  access: ContactAccessFilter;
  ratingSort: "asc" | "desc" | null;
}

/** Каталог исполнителей, сделки и условия текущего пользователя, открытая сделка. */
export interface ExpertContactsState {
  experts: ExpertContact[];
  deals: ContactDealListItem[];
  offer: ExpertContactOffer | null;
  openedDeal: ContactDeal | null;
  isLoading: boolean;
  error: string | null;
}
