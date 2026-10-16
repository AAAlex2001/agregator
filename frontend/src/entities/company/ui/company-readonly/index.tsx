import { TextInput } from "@/shared/ui/text-input";
import { VerifiedBadge } from "@/shared/ui/verified-badge";
import styles from "./style.module.scss";

/** Подтверждённые название компании и ИНН из профиля пользователя. */
interface CompanyReadonlyProps {
  companyName: string;
  inn: string;
}

/** Показывает реквизиты компании, которые меняются через службу поддержки. */
export function CompanyReadonly({ companyName, inn }: CompanyReadonlyProps) {
  return (
    <div className={styles.block}>
      <div className={styles.cell}>
        <TextInput
          id="company"
          placeholder="Компания"
          aria-label="Компания"
          value={companyName}
          disabled
        />
        <VerifiedBadge>Компания подтверждена</VerifiedBadge>
      </div>

      <div className={styles.cell}>
        <TextInput
          id="inn"
          placeholder="ИНН"
          aria-label="ИНН"
          value={inn}
          disabled
        />
        <VerifiedBadge>ИНН подтверждён</VerifiedBadge>
      </div>

      <p className={styles.hint}>Для смены компании обратитесь в службу поддержки.</p>
    </div>
  );
}
