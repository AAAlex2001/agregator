import type { LaborCertificate } from "@/source/entities/labor";

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
