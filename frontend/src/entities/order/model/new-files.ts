import { SINGLE_ORDER_DOCUMENT_CATEGORIES } from "../config/files";
import type { NewOrderFiles } from "./order-request";

/** Собирает новые файлы в порядке категорий для отправки и проверки лимитов. */
export function getNewOrderFiles(files: NewOrderFiles): File[] {
  const singleFiles = SINGLE_ORDER_DOCUMENT_CATEGORIES
    .map((category) => files[category])
    .filter((file) => file !== null);

  return [...singleFiles, ...files.other];
}
