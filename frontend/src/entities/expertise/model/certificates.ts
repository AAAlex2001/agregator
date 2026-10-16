import type { CertificateFields, ExpertCertificate } from "./types";

/** Добавляет заполненное удостоверение, сохраняя список при совпадении всех полей. */
export function addCertificate(
  certificates: ExpertCertificate[],
  fields: CertificateFields,
): ExpertCertificate[] {
  if (!fields.area || !fields.object || !fields.category || !fields.expiresAt) {
    return certificates;
  }

  const certificate: ExpertCertificate = {
    area: fields.area,
    object: fields.object,
    category: fields.category,
    expires_at: fields.expiresAt.slice(0, 10),
  };
  const exists = certificates.some((item) => {
    return item.area === certificate.area
      && item.object === certificate.object
      && item.category === certificate.category
      && item.expires_at === certificate.expires_at;
  });

  return exists ? certificates : [...certificates, certificate];
}
