import { formatRussianPhone } from "@/shared/lib/phone";
import type { RegistrationAccount } from "../../model/account";
import { Agreements } from "../agreements";
import { ContactFields } from "../contact-fields";
import { PasswordFields } from "../password-fields";

/** Общие контакты, пароль и согласия для любой роли регистрации. */
interface AccountFieldsProps {
  value: RegistrationAccount;
  onChange: (value: RegistrationAccount) => void;
}

/** Собирает одинаковые поля аккаунта после ролевой части формы. */
export function AccountFields({ value, onChange }: AccountFieldsProps) {
  return (
    <>
      <ContactFields
        email={value.email}
        phone={value.phone}
        onEmailChange={(email) => onChange({ ...value, email })}
        onPhoneChange={(phone) => onChange({
          ...value,
          phone: formatRussianPhone(phone),
        })}
      />
      <PasswordFields
        password={value.password}
        passwordConfirmation={value.passwordConfirmation}
        onPasswordChange={(password) => onChange({ ...value, password })}
        onConfirmationChange={(passwordConfirmation) => onChange({
          ...value,
          passwordConfirmation,
        })}
      />
      <Agreements
        privacyAccepted={value.privacyAccepted}
        termsAccepted={value.termsAccepted}
        personalDataAccepted={value.personalDataAccepted}
        onPrivacyChange={(privacyAccepted) => onChange({ ...value, privacyAccepted })}
        onTermsChange={(termsAccepted) => onChange({ ...value, termsAccepted })}
        onPersonalDataChange={(personalDataAccepted) => onChange({
          ...value,
          personalDataAccepted,
        })}
      />
    </>
  );
}

