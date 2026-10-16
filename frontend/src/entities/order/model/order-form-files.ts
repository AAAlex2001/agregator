import type { LocalFile } from "@/shared/lib/local-file";
import { getOrderDocumentPaths } from "./documents";
import type { OrderFormValues } from "./order-form-types";

/** Собирает новые документы в порядке категорий формы. */
export function getOrderFormFiles(values: OrderFormValues): LocalFile[] {
  const singleFiles = [
    values.files.technical,
    values.files.contract,
    values.files.company,
  ].filter((file) => file !== null);

  return [...singleFiles, ...values.files.other];
}

/** Считает сохранённые документы и ещё не загруженные файлы формы. */
export function countOrderFormFiles(values: OrderFormValues): number {
  return getOrderDocumentPaths(values.documents).length
    + getOrderFormFiles(values).length;
}

/** Считает общий размер только новых файлов, отправляемых вместе с заказом. */
export function getOrderFormFilesSize(values: OrderFormValues): number {
  return getOrderFormFiles(values).reduce((total, localFile) => (
    total + localFile.file.size
  ), 0);
}
