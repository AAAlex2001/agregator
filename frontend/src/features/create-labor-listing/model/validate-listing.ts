import type { LaborListingRequest } from "@/entities/labor";

/** Возвращает первую ошибку объявления или пустую строку, если его можно публиковать. */
export function validateLaborListing(
  request: LaborListingRequest,
  otherProfession: boolean,
): string {
  const isExpert = request.kind === "EXPERT_AVAILABLE";

  if (!request.region) {
    return "Укажите регион фактического проживания";
  }

  if (otherProfession && !request.other_profession) {
    return isExpert ? "Опишите свою профессию" : "Опишите, кого вы ищете";
  }

  if (!otherProfession && request.certificates.length === 0) {
    return isExpert
      ? "Укажите хотя бы одно удостоверение"
      : "Выберите удостоверение или вид экспертизы";
  }

  if (request.employment_term === "FIXED" && !request.fixed_term) {
    return "Укажите срок срочного договора";
  }

  if (!isExpert && !request.start_date) {
    return "Укажите дату выхода на работу";
  }

  return "";
}
