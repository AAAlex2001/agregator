import { type Dispatch } from "react";
import { TextField } from "@/shared/ui";
import { PHONE_PLACEHOLDER, formatPhone } from "@/shared/lib/phone";
import { type RegisterAction, type RegisterState } from "../../model/reducer";
import s from "../register-sheet.module.scss";

interface Props {
  state: RegisterState;
  dispatch: Dispatch<RegisterAction>;
  phoneRequired: boolean;
}

export function AccountFields({ state, dispatch, phoneRequired }: Props) {
  return (
    <>
      <TextField
        label="Электронная почта"
        type="email"
        inputMode="email"
        placeholder="Электронная почта"
        value={state.email}
        onChange={(e) => dispatch({ type: "set", key: "email", value: e.target.value })}
      />
      <TextField
        label={phoneRequired ? "Телефон" : "Телефон (необязательно)"}
        inputMode="tel"
        placeholder={PHONE_PLACEHOLDER}
        value={state.phone}
        onChange={(e) => dispatch({ type: "set", key: "phone", value: formatPhone(e.target.value) })}
      />
      <TextField
        label="Пароль"
        password
        placeholder="Пароль"
        value={state.password}
        onChange={(e) => dispatch({ type: "set", key: "password", value: e.target.value })}
      />
      <span className={s.hint}>Минимум 6 символов, заглавная и строчная буквы</span>
      <TextField
        label="Повторите пароль"
        password
        placeholder="Повторите пароль"
        value={state.confirm}
        onChange={(e) => dispatch({ type: "set", key: "confirm", value: e.target.value })}
      />
    </>
  );
}
