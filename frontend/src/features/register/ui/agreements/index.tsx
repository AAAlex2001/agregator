import Link from "next/link";
import { Checkbox } from "@/shared/ui/checkbox";
import styles from "./style.module.scss";

/** Обязательные согласия, которые API принимает при создании аккаунта. */
interface AgreementsProps {
  privacyAccepted: boolean;
  termsAccepted: boolean;
  personalDataAccepted: boolean;
  onPrivacyChange: (accepted: boolean) => void;
  onTermsChange: (accepted: boolean) => void;
  onPersonalDataChange: (accepted: boolean) => void;
}

/** Запрашивает три обязательных согласия и открывает документы в новой вкладке. */
export function Agreements({
  privacyAccepted,
  termsAccepted,
  personalDataAccepted,
  onPrivacyChange,
  onTermsChange,
  onPersonalDataChange,
}: AgreementsProps) {
  return (
    <div className={styles.agreements}>
      <Checkbox
        id="register-consent-privacy"
        required
        checked={privacyAccepted}
        onChange={onPrivacyChange}
      >
        Я соглашаюсь с{" "}
        <Link
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Политикой конфиденциальности
        </Link>
      </Checkbox>

      <Checkbox
        id="register-consent-terms"
        required
        checked={termsAccepted}
        onChange={onTermsChange}
      >
        Я соглашаюсь с{" "}
        <Link
          href="/user-agreement"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Пользовательским соглашением
        </Link>
      </Checkbox>

      <Checkbox
        id="register-consent-personal"
        required
        checked={personalDataAccepted}
        onChange={onPersonalDataChange}
      >
        Я даю{" "}
        <Link
          href="/personal-data-consent"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Согласие на обработку персональных данных
        </Link>
      </Checkbox>
    </div>
  );
}
