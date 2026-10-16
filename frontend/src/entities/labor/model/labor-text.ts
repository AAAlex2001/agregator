import type { LaborCertificate, LaborListing } from "./types";

/** Показывает удостоверение как «Э1 · КЛ · 2 кат. — до 01.01.2027». */
export function formatLaborCertificate(certificate: LaborCertificate): string {
  const category = certificate.category ? `${certificate.category} кат.` : "";
  const text = [certificate.area, certificate.object, category]
    .filter(Boolean)
    .join(" · ");

  if (!certificate.expires_at) {
    return text;
  }

  return `${text} — до ${certificate.expires_at}`;
}

/** Показывает дату API «2026-10-17» как «17.10.2026» без сдвига часового пояса. */
export function formatLaborDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("ru-RU");
}

/** Возвращает подпись вида объявления. */
export function getLaborKindLabel(item: LaborListing): string {
  if (item.kind === "EXPERT_WANTED") {
    return "Организация ищет исполнителя";
  }

  return "Исполнитель готов к трудоустройству";
}

/** Описывает иную профессию или перечисляет требуемые удостоверения. */
export function getLaborRequirementText(item: LaborListing): string {
  if (item.other_profession) {
    return item.other_profession;
  }

  return item.certificates.map(formatLaborCertificate).join(", ");
}

/** Описывает срок трудоустройства. */
export function getLaborEmploymentText(item: LaborListing): string {
  if (item.employment_term === "PERMANENT") {
    return "Постоянная работа";
  }

  return `Срочный договор: ${item.fixed_term ?? ""}`.trim();
}
