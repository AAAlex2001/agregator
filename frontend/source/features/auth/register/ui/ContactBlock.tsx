import { EmailInput, PhoneInput } from "@/source/shared/ui/Inputs";
import { formatRussianPhone } from "@/source/shared/lib/phone";
import type { StepProps } from "./types";
import s from "./register-form.module.scss";

export function ContactBlock({ state, dispatch, showPhoneHint = true }: StepProps & { showPhoneHint?: boolean }) {
  return (
    <>
      <EmailInput
        id="email"
        value={state.email}
        required
        autoComplete="off"
        onChange={(e) => dispatch({ type: "set", key: "email", value: e.target.value })}
        placeholder="Электронная почта"
      />

      <div className={s.phoneBlock}>
        <PhoneInput
          id="phone"
          value={state.phone}
          autoComplete="off"
          onChange={(e) => dispatch({ type: "set", key: "phone", value: formatRussianPhone(e.target.value) })}
          placeholder="+7-999-999-99-12"
        />
        {showPhoneHint && <p className={s.contactHint}>Номер телефона необязателен</p>}
      </div>
    </>
  );
}
