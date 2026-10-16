import type { OrderDocuments } from "./types";

/** Возвращает документы в порядке: задание, договор, предприятие, остальные файлы. */
export function getOrderDocumentPaths(documents: OrderDocuments): string[] {
  return [
    ...documents.technical,
    ...documents.contract,
    ...documents.company,
    ...documents.other,
  ];
}
