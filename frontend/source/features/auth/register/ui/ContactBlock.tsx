import { formatRussianPhone } from "@/source/shared/lib/phone";
import { EmailInput, PhoneInput } from "@/source/shared/ui/Inputs";
import type { StepProps } from "./types";
import s from "./ContactBlock.module.scss";

/** Почта (обязательна — на неё придёт код) и телефон. */
export function ContactBlock({ state, dispatch }: StepProps) {
  return (
    <>
      <EmailInput
        id="register-email"
        value={state.email}
        required
        autoComplete="off"
        onChange={(event) => dispatch({ type: "set", key: "email", value: event.target.value })}
        placeholder="Электронная почта"
      />
      <div className={s.phone}>
        <PhoneInput
          id="register-phone"
          value={state.phone}
          autoComplete="off"
          onChange={(event) => dispatch({ type: "set", key: "phone", value: formatRussianPhone(event.target.value) })}
          placeholder="+7-999-999-99-99"
        />
        <p className={s.hint}>Номер телефона необязателен</p>
      </div>
    </>
  );
}
