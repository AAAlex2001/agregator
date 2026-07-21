import type { LaborCertificate } from "@/source/entities/labor";
import { formatLaborCertificate } from "../lib/formatters";
import s from "./LaborForm.module.scss";

interface ExpertCertificatesFieldProps {
  certificates: LaborCertificate[];
}

export function ExpertCertificatesField({
  certificates,
}: ExpertCertificatesFieldProps) {
  return (
    <div className={s.fieldGroup}>
      <span className={s.label}>Удостоверения из профиля</span>

      {certificates.length > 0 ? (
        <div className={s.profileCertificates}>
          {certificates.map((certificate, index) => (
            <span
              key={`${certificate.area}-${certificate.object}-${certificate.category}-${index}`}
            >
              {formatLaborCertificate(certificate)}
            </span>
          ))}
        </div>
      ) : (
        <p className={s.hint}>
          В профиле пока нет удостоверений. Добавьте их в настройках.
        </p>
      )}
    </div>
  );
}
