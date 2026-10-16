import type { ReactNode } from "react";
import {
  formatLaborCertificate,
  formatLaborDate,
  getLaborEmploymentText,
  getLaborKindLabel,
} from "../../model/labor-text";
import type { LaborListing } from "../../model/types";
import styles from "./style.module.scss";

/** Объявление и блоки действий под его условиями. */
interface LaborListingCardProps {
  item: LaborListing;
  children: ReactNode;
}

/** Показывает автора, регион, требования и условия трудоустройства. */
export function LaborListingCard({ item, children }: LaborListingCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{item.owner_name}</h2>
          <p className={styles.kind}>{getLaborKindLabel(item)}</p>
        </div>
        <span className={styles.region}>{item.region}</span>
      </div>

      {item.other_profession ? (
        <div className={styles.otherProfession}>
          <span className={styles.otherProfessionLabel}>Иная профессия</span>
          <p className={styles.otherProfessionText}>{item.other_profession}</p>
        </div>
      ) : (
        <div className={styles.certificates}>
          {item.certificates.map((certificate) => (
            <span
              key={`${certificate.area}-${certificate.object}-${certificate.category}`}
              className={styles.certificate}
            >
              {formatLaborCertificate(certificate)}
            </span>
          ))}
        </div>
      )}

      <dl className={styles.meta}>
        <div>
          <dt>Формат</dt>
          <dd>{getLaborEmploymentText(item)}</dd>
        </div>

        {item.start_date && (
          <div>
            <dt>Приступить</dt>
            <dd>{formatLaborDate(item.start_date)}</dd>
          </div>
        )}

        {item.employment_type && (
          <div>
            <dt>Место работы</dt>
            <dd>{item.employment_type === "PRIMARY" ? "Основное" : "Совместительство"}</dd>
          </div>
        )}

        {item.current_job_status && (
          <div>
            <dt>Сейчас</dt>
            <dd>
              {item.current_job_status === "NONE"
                ? "Основное место работы отсутствует"
                : "Работает, потребуется увольнение"}
            </dd>
          </div>
        )}
      </dl>

      {children}
    </article>
  );
}
