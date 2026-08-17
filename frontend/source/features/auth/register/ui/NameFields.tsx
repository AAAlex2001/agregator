import { TextInput } from "@/source/shared/ui/Inputs";
import type { StepProps } from "./types";

export function NameFields({ state, dispatch }: StepProps) {
  return (
    <>
      <TextInput
        id="lastName"
        value={state.lastName}
        autoComplete="off"
        onChange={(event) => dispatch({ type: "set", key: "lastName", value: event.target.value })}
        placeholder="Фамилия"
      />
      <TextInput
        id="firstName"
        value={state.firstName}
        autoComplete="off"
        onChange={(event) => dispatch({ type: "set", key: "firstName", value: event.target.value })}
        placeholder="Имя"
      />
    </>
  );
}
