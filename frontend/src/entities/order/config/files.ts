import type { SingleOrderDocumentCategory } from "../model/order-request";

/** Максимальное количество документов во всех категориях заказа. */
export const MAX_ORDER_DOCUMENTS = 6;

/** Суммарный размер новых файлов заказа в байтах. */
export const MAX_ORDER_FILES_TOTAL_BYTES = 100 * 1024 * 1024;

/** Поддерживаемые форматы документов в форме заказа. */
export const ORDER_DOCUMENT_ACCEPT = ".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx,.zip,.rar,.7z";

/** Подписи категорий документов заказа. */
export const ORDER_DOCUMENT_LABELS = {
  technical: "Техническое задание",
  contract: "Проект договора",
  company: "Карточка предприятия",
  other: "Иное",
};

/** Порядок категорий с одним файлом в форме и multipart-запросе. */
export const SINGLE_ORDER_DOCUMENT_CATEGORIES: SingleOrderDocumentCategory[] = [
  "technical",
  "contract",
  "company",
];
