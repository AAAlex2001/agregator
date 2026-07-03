import { Checkbox, Field, TextField } from "@/shared/ui";
import { AddressSuggest } from "@/entites/geo";
import { type StepProps } from "./types";
import { Attestation } from "./attestation";

export function ExpertStep({ state, dispatch }: StepProps) {
  return (
    <>
      <TextField
        label="Фамилия"
        placeholder="Фамилия"
        value={state.lastName}
        onChange={(e) => dispatch({ type: "set", key: "lastName", value: e.target.value })}
      />
      <TextField
        label="Имя"
        placeholder="Имя"
        value={state.firstName}
        onChange={(e) => dispatch({ type: "set", key: "firstName", value: e.target.value })}
      />
      <Field label="Где вы находитесь (необязательно)">
        <AddressSuggest
          value={state.locationAddress}
          onChangeText={(v) => dispatch({ type: "addressText", value: v })}
          onPick={(point) => dispatch({ type: "location", point })}
        />
      </Field>
      <Checkbox checked={state.travels} onChange={(v) => dispatch({ type: "travels", value: v })}>
        Готов выезжать на объекты в другие регионы
      </Checkbox>

      <Attestation state={state} dispatch={dispatch} />
    </>
  );
}
