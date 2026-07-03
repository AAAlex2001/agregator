import { CodeInput } from "@/shared/ui";
import { type StepProps } from "./types";
import s from "./code-step.module.scss";

interface Props extends StepProps {
  onResend: () => void;
}

export function CodeStep({ state, dispatch, onResend }: Props) {
  return (
    <>
      <p className={s.hint}>Мы отправили код подтверждения на {state.email.trim()}. Введите его ниже.</p>
      <CodeInput value={state.code} onChange={(v) => dispatch({ type: "set", key: "code", value: v })} />
      <button type="button" className={s.resend} onClick={onResend}>
        Отправить код повторно
      </button>
    </>
  );
}
