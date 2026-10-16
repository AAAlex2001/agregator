import type { ResponseTab } from "./types";

/** Приводит вкладку из адреса страницы к известной, иначе открывает все отклики. */
export function toResponseTab(value: string | undefined): ResponseTab {
  if (
    value === "review"
    || value === "in_progress"
    || value === "rejected"
    || value === "accepted"
    || value === "withdrawn_by_expert"
  ) {
    return value;
  }

  return "all";
}
