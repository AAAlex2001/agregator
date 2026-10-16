import type { ExpertCertificate } from "../../model/types";
import { TypeBadge } from "../type-badge";
import styles from "./style.module.scss";

/** Добавленные удостоверения с действием удаления по позиции. */
interface CertificateListProps {
  certificates: ExpertCertificate[];
  onRemove: (index: number) => void;
}

/** Показывает добавленные удостоверения и позволяет удалить выбранное. */
export function CertificateList({
  certificates,
  onRemove,
}: CertificateListProps) {
  if (certificates.length === 0) {
    return null;
  }

  return (
    <ul className={styles.certList}>
      {certificates.map((certificate, index) => (
        <li
          key={[
            certificate.area,
            certificate.object,
            certificate.category,
            certificate.expires_at ?? "",
          ].join("-")}
          className={styles.certRow}
        >
          <span className={styles.certContent}>
            <span className={styles.certArea}>{certificate.area}</span>
            <TypeBadge
              type={certificate.object}
              active
            />
            <span className={styles.certCat}>
              · {certificate.category} кат.
            </span>
            {certificate.expires_at && (
              <span className={styles.certExpiry}>
                · до {certificate.expires_at}
              </span>
            )}
          </span>
          <button
            type="button"
            className={styles.certRemove}
            onClick={() => onRemove(index)}
            aria-label="Удалить удостоверение"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
