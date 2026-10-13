import { TextInput } from "@/source/shared/ui/Inputs";
import type { StepProps } from "./types";

/** Фамилия и имя. */
export function NameFields({ state, dispatch }: StepProps) {
  return (
    <>
      <TextInput
        id="register-last-name"
        value={state.lastName}
        autoComplete="off"
        onChange={(event) => dispatch({ type: "set", key: "lastName", value: event.target.value })}
        placeholder="Фамилия"
      />
      <TextInput
        id="register-first-name"
        value={state.firstName}
        autoComplete="off"
        onChange={(event) => dispatch({ type: "set", key: "firstName", value: event.target.value })}
        placeholder="Имя"
      />
    </>
  );
}
