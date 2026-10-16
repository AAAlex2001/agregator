import type { ExpertCertificate, ExpertiseProfileValues } from "../../model/types";
import { CertificateBuilder } from "../certificate-builder";
import styles from "./style.module.scss";

/** Редактируемая анкета ЭПБ для регистрации и профиля. */
interface ExpertiseProfileFieldsProps {
  value: ExpertiseProfileValues;
  onChange: (profile: ExpertiseProfileValues) => void;
}

/** Показывает удостоверения эксперта промышленной безопасности. */
export function ExpertiseProfileFields({
  value,
  onChange,
}: ExpertiseProfileFieldsProps) {
  /** Обновляет список удостоверений в редактируемой анкете. */
  function changeCertificates(certificates: ExpertCertificate[]) {
    onChange({
      certificates,
    });
  }

  return (
    <div className={styles.fields}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Удостоверения</span>
        <span className={styles.sectionHint}>
          Добавьте свои удостоверения — область аттестации, объект экспертизы и категорию
        </span>
        <CertificateBuilder
          value={value.certificates}
          onChange={changeCertificates}
        />
      </div>
    </div>
  );
}
