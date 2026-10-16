/** Параметры каталога, в которых можно выбрать несколько значений. */
export type RtnOptionFilter =
  | "document_type"
  | "status"
  | "oversight_area"
  | "industry"
  | "activity"
  | "object_type";

/** Границы периода публикации разъяснений. */
export type RtnDateFilter = "published_from" | "published_to";
