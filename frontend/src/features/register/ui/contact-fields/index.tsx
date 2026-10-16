import { EmailInput } from "@/shared/ui/email-input";
import { PhoneInput } from "@/shared/ui/phone-input";
import styles from "./style.module.scss";

/** Почта и необязательный телефон новой учётной записи. */
interface ContactFieldsProps {
  email: string;
  phone: string;
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
}

/** Показывает обязательную почту и необязательный телефон регистрации. */
export function ContactFields({
  email,
  phone,
  onEmailChange,
  onPhoneChange,
}: ContactFieldsProps) {
  return (
    <>
      <EmailInput
        id="register-email"
        value={email}
        required
        autoComplete="off"
        onChange={(event) => onEmailChange(event.target.value)}
        placeholder="Электронная почта"
      />
      <div className={styles.phone}>
        <PhoneInput
          id="register-phone"
          value={phone}
          autoComplete="off"
          onChange={(event) => onPhoneChange(event.target.value)}
          placeholder="+7-999-999-99-99"
        />
        <p className={styles.hint}>Номер телефона необязателен</p>
      </div>
    </>
  );
}
