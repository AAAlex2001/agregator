import { FormGrid } from "@/shared/ui/form-grid";
import { FormSection } from "@/shared/ui/form-section";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Роль аккаунта: у заказчика в заглушке есть поля компании. */
interface PersonalSettingsSkeletonProps {
  isCustomer: boolean;
}

/** Сохраняет размеры личных данных, пока загружается профиль. */
export function PersonalSettingsSkeleton({ isCustomer }: PersonalSettingsSkeletonProps) {
  return (
    <div
      className={styles.form}
      aria-hidden="true"
    >
      <div className={styles.avatarSection}>
        <Skeleton
          className={styles.avatarCircle}
          rounded="pill"
        />
        <div className={styles.avatarContent}>
          <Skeleton className={styles.avatarButton} />
          <span className={styles.avatarHint}>JPG, PNG до 5 МБ</span>
        </div>
      </div>

      <FormSection title="Персональные данные">
        <FormGrid>
          <Skeleton
            className={styles.input}
            rounded="lg"
          />
          <Skeleton
            className={styles.input}
            rounded="lg"
          />
          <Skeleton
            className={styles.input}
            rounded="lg"
          />
          <div className={styles.emailCell}>
            <Skeleton
              className={styles.input}
              rounded="lg"
            />
            <Skeleton
              className={styles.verifiedBadge}
              rounded="pill"
            />
          </div>
        </FormGrid>

        {isCustomer && (
          <div className={styles.companyBlock}>
            <div className={styles.emailCell}>
              <Skeleton
                className={styles.input}
                rounded="lg"
              />
              <Skeleton
                className={styles.verifiedBadge}
                rounded="pill"
              />
            </div>
            <div className={styles.emailCell}>
              <Skeleton
                className={styles.input}
                rounded="lg"
              />
              <Skeleton
                className={styles.verifiedBadge}
                rounded="pill"
              />
            </div>
            <Skeleton
              className={styles.companyHint}
              rounded="pill"
            />
          </div>
        )}
      </FormSection>

      <FormSection title="Изменить пароль">
        <FormGrid>
          <Skeleton
            className={styles.input}
            rounded="lg"
          />
          <Skeleton
            className={styles.input}
            rounded="lg"
          />
        </FormGrid>
      </FormSection>
    </div>
  );
}
