import { EmailInput, PhoneInput } from "@/source/shared/ui/Inputs";
import s from "./ContactFields.module.scss";

interface Props {
  phone: string;
  email: string;
  emailVerified: boolean;
  onChangePhone: (v: string) => void;
  onChangeEmail: (v: string) => void;
}

const VerifiedBadge = ({ children }: { children: React.ReactNode }) => (
  <span className={s.verifiedBadge}>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M11.2 4.2 5.833 9.567 2.8 6.533l.933-.933 2.1 2.1 4.434-4.433.933.933Z"
        fill="currentColor"
      />
    </svg>
    {children}
  </span>
);

export function ContactFields({
  phone,
  email,
  emailVerified,
  onChangePhone,
  onChangeEmail,
}: Props) {
  return (
    <>
      <PhoneInput
        id="phone"
        name="profile-phone"
        placeholder="+7-999-999-99-12"
        aria-label="Телефон"
        autoComplete="off"
        value={phone}
        onChange={(e) => onChangePhone(e.target.value)}
      />
      <div className={s.emailCell}>
        <EmailInput
          id="email"
          name="profile-email"
          placeholder="Электронная почта"
          aria-label="Email"
          autoComplete="off"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
        />
        {emailVerified && <VerifiedBadge>Почта подтверждена</VerifiedBadge>}
      </div>
    </>
  );
}

export { VerifiedBadge };
