import type { LaborCertificate, LaborListingData } from "@/source/entities/labor";

export function formatLaborCertificate(
  certificate: LaborCertificate,
): string {
  const parts = [
    certificate.area,
    certificate.object,
    certificate.category
      ? `${certificate.category} кат.`
      : "",
  ].filter(Boolean);
  const main = parts.join(" · ");

  return certificate.expires_at
    ? `${main} — до ${certificate.expires_at}`
    : main;
}

export function formatLaborDate(value: string | null): string {
  if (!value) {
    return "";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("ru-RU");
}

export function laborKindLabel(kind: LaborListingData["kind"]): string {
  return kind === "EXPERT_WANTED"
    ? "Организация ищет эксперта"
    : "Эксперт готов к трудоустройству";
}

export function laborRequirementText(item: LaborListingData): string {
  if (item.other_profession) {
    return item.other_profession;
  }
  return item.certificates.map(formatLaborCertificate).join(", ");
}

export function laborEmploymentText(item: LaborListingData): string {
  return item.employment_term === "PERMANENT"
    ? "Постоянная работа"
    : `Срочный договор: ${item.fixed_term ?? ""}`.trim();
}

export function laborShareTitle(item: LaborListingData): string {
  const requirement = laborRequirementText(item);
  const base = laborKindLabel(item.kind);
  return requirement ? `${base} · ${requirement}` : base;
}

export function laborShareDescription(item: LaborListingData): string {
  return [item.region, laborEmploymentText(item)]
    .filter(Boolean)
    .join(" · ");
}
