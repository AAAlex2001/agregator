import type { FieldPlace } from "@/shared/lib/step-error";
import { BLITZ_COMPANY_FIELDS } from "../config/company";
import type { BlitzCompany } from "./types";

/** Первое незаполненное поле реквизитов или null. КПП необязателен: у ИП его нет. */
export function blitzCompanyProblem(company: BlitzCompany): string | null {
  const missing = BLITZ_COMPANY_FIELDS.find(
    (item) => item.field !== "kpp" && !(company[item.field] ?? "").trim(),
  );

  return missing ? `Заполните поле «${missing.label}»` : null;
}
/** Где реквизиты организации в форме заявки: поля company.* на шаге step. */
export function blitzCompanyPlaces<Step extends string>(step: Step): FieldPlace<Step>[] {
  return [
    { path: "company", step, label: "Реквизиты организации" },
    ...BLITZ_COMPANY_FIELDS.map((item) => ({
      path: `company.${item.field}`,
      step,
      label: item.label,
    })),
  ];
}