import cn from "classnames";
import type { ExpertContact } from "@/entities/expert-contact";
import { getExpertiseTypeColor } from "@/entities/expertise";
import { EmailIcon, PhoneIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Исполнитель из каталога контактов. */
interface ExpertContactDetailsProps {
  expert: ExpertContact;
}

/** Показывает регион, области аттестации и скрытые или открытые контакты исполнителя. */
export function ExpertContactDetails({ expert }: ExpertContactDetailsProps) {
  return (
    <div className={styles.details}>
      <span className={styles.label}>Области аттестации и контакты</span>
      <span className={styles.city}>{expert.city || "Регион не указан"}</span>
      <div className={styles.certificates}>
        {expert.certificates.slice(0, 8).map((certificate) => {
          const tone = getExpertiseTypeColor(certificate.object ?? "") ?? "gray";

          return (
            <span
              key={`${certificate.area}-${certificate.object}-${certificate.category}`}
              className={cn(styles.certificate, styles[tone])}
            >
              {certificate.area && <strong>{certificate.area}</strong>}
              {certificate.object && <span>{certificate.object}</span>}
              {certificate.category && <span>{certificate.category} кат.</span>}
            </span>
          );
        })}
        {expert.certificates.length === 0 && (
          <span className={styles.emptyCertificates}>Области аттестации не указаны</span>
        )}
      </div>
      <div className={styles.contacts}>
        <div>
          <PhoneIcon />
          <span>{expert.phone || expert.masked_phone || "Телефон не указан"}</span>
        </div>
        <div>
          <EmailIcon />
          <span>{expert.email || expert.masked_email || "Email не указан"}</span>
        </div>
      </div>
    </div>
  );
}
