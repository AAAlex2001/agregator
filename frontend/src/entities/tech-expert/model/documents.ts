import type { TechExpertDocument } from "./types";

/** Переводит дату фонда «2024-03-05» в «05.03.2024»; другой формат оставляет как есть. */
export function formatTechExpertDate(value: string | null): string {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${day}.${month}.${year}`;
}

/** Строка реквизитов документа: тип, номер, дата и ведомство через точку. */
export function getTechExpertDocumentMeta(document: TechExpertDocument): string {
  return [
    document.doctype,
    document.number,
    formatTechExpertDate(document.date),
    document.department,
  ]
    .filter(Boolean)
    .join(" · ");
}

/** Подпись уровня доступа к документу; неизвестный уровень показывается как есть. */
export function getTechExpertAccessLabel(access: string): string {
  if (access === "full") {
    return "Полный доступ";
  }

  if (access === "card") {
    return "Карточка";
  }

  if (access === "restricted") {
    return "Ограничен";
  }

  return access;
}
