import { type Dispatch } from "react";
import { CodeInput } from "@/shared/ui";
import { type RegisterAction } from "../model/reducer";
import s from "./register-sheet.module.scss";

interface Props {
  email: string;
  code: string;
  dispatch: Dispatch<RegisterAction>;
  onResend: () => void;
}

export function CodeStep({ email, code, dispatch, onResend }: Props) {
  return (
    <>
      <p className={s.codeHint}>Мы отправили код подтверждения на {email.trim()}. Введите его ниже.</p>
      <CodeInput value={code} onChange={(v) => dispatch({ type: "set", key: "code", value: v })} />
      <button type="button" className={s.resend} onClick={onResend}>
        Отправить код повторно
      </button>
    </>
  );
}
