import { BLITZ_COMPANY_FIELDS } from "../config/company";
import type { BlitzCompany } from "./types";

/** Первое незаполненное поле реквизитов или null. КПП необязателен: у ИП его нет. */
export function blitzCompanyProblem(company: BlitzCompany): string | null {
  const missing = BLITZ_COMPANY_FIELDS.find(
    (item) => item.field !== "kpp" && !(company[item.field] ?? "").trim(),
  );

  return missing ? `Заполните поле «${missing.label}»` : null;
}