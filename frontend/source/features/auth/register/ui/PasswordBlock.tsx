import { PASSWORD_MIN_LENGTH, PasswordRequirements } from "@/source/entities/user";
import { PasswordInput } from "@/source/shared/ui/Inputs";
import type { StepProps } from "./types";

/** Пароль, его повтор и список требований. */
export function PasswordBlock({ state, dispatch }: StepProps) {
  return (
    <>
      <PasswordInput
        id="register-password"
        value={state.password}
        required
        minLength={PASSWORD_MIN_LENGTH}
        autoComplete="new-password"
        onChange={(event) => dispatch({ type: "set", key: "password", value: event.target.value })}
        placeholder="Пароль"
      />
      <PasswordInput
        id="register-password-repeat"
        value={state.confirm}
        required
        autoComplete="new-password"
        onChange={(event) => dispatch({ type: "set", key: "confirm", value: event.target.value })}
        placeholder="Повторите пароль"
      />
      <PasswordRequirements password={state.password} />
    </>
  );
}
