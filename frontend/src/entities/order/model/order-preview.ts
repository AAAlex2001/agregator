import { formatDateRu } from "@/shared/lib/format-date";
import type { LocalFile } from "@/shared/lib/local-file";
import type { OrderCardData } from "./order-card-data";
import type { OrderFormValues } from "./order-form-types";
import type { OrderBadge, OrderDocuments } from "./types";

/** Добавляет локальные документы к сохранённым путям, сохраняя имя для галереи. */
function addSelectedDocuments(
  paths: string[],
  files: (LocalFile | null)[],
): string[] {
  const selectedPaths = files
    .filter((selected) => selected !== null)
    .map((selected) => (
      `${selected.previewUrl}#name=${encodeURIComponent(selected.file.name)}`
    ));

  return [...paths, ...selectedPaths];
}

/** Собирает документы предпросмотра из сохранённых путей и выбранных файлов. */
export function getOrderPreviewDocuments(values: OrderFormValues): OrderDocuments {
  return {
    technical: addSelectedDocuments(
      values.documents.technical,
      [values.files.technical],
    ),
    contract: addSelectedDocuments(
      values.documents.contract,
      [values.files.contract],
    ),
    company: addSelectedDocuments(
      values.documents.company,
      [values.files.company],
    ),
    other: addSelectedDocuments(values.documents.other, values.files.other),
  };
}

/** Подготавливает карточку черновика без служебных полей опубликованного заказа. */
export function getOrderPreviewCard(
  values: OrderFormValues,
  customerInn: string,
  badges: OrderBadge[],
): OrderCardData {
  const budget = Number(values.budget);

  return {
    id: 0,
    title: values.title.trim() || "Название заказа",
    company: values.company.trim() || "—",
    customer_name: "",
    customer_inn: customerInn,
    start_date: formatDateRu(values.startDate),
    date: formatDateRu(values.deadline),
    sum: budget > 0 ? `${budget.toLocaleString("ru-RU")} ₽` : "",
    responses_deadline: values.responsesDeadline || null,
    created_at_display: "",
    status: "ACTIVE",
    work_type: values.workType,
    badges,
    previous_title: null,
    previous_sum: null,
    previous_date: null,
    previous_badges: null,
  };
}
