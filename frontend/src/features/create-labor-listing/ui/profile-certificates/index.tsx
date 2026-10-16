import type { ExpertCertificate } from "@/entities/expertise";
import { formatLaborCertificate } from "@/entities/labor";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Удостоверения из анкеты ЭПБ и состояние их загрузки. */
interface ProfileCertificatesProps {
  certificates: ExpertCertificate[];
  isLoading: boolean;
  hasError: boolean;
}

/** Показывает удостоверения из профиля, которые попадут в объявление исполнителя. */
export function ProfileCertificates({
  certificates,
  isLoading,
  hasError,
}: ProfileCertificatesProps) {
  if (hasError) {
    return (
      <p
        className={styles.error}
        role="alert"
      >
        Не удалось загрузить удостоверения из профиля. Обновите страницу.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div
        className={styles.group}
        role="status"
        aria-label="Загружаем удостоверения из профиля"
      >
        <span className={styles.label}>Удостоверения из профиля</span>
        <Skeleton
          className={styles.skeleton}
          rounded="pill"
        />
      </div>
    );
  }

  return (
    <div className={styles.group}>
      <span className={styles.label}>Удостоверения из профиля</span>
      <div className={styles.list}>
        {certificates.map((certificate) => (
          <span
            key={`${certificate.area}-${certificate.object}-${certificate.category}`}
            className={styles.certificate}
          >
            {formatLaborCertificate(certificate)}
          </span>
        ))}
      </div>
    </div>
  );
}
