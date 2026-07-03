import { type Dispatch } from "react";
import { Checkbox, TextField } from "@/shared/ui";
import { AddressSuggest } from "@/entites/geo";
import { type RegisterAction, type RegisterState } from "../../model/reducer";
import s from "../register-sheet.module.scss";

interface Props {
  state: RegisterState;
  dispatch: Dispatch<RegisterAction>;
}

export function ExpertFields({ state, dispatch }: Props) {
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
      <div className={s.field}>
        <span className={s.label}>Где вы находитесь (необязательно)</span>
        <AddressSuggest
          value={state.locationAddress}
          onChangeText={(v) => dispatch({ type: "set", key: "locationAddress", value: v })}
          onPick={(point) => dispatch({ type: "location", point })}
        />
      </div>
      <Checkbox checked={state.travels} onChange={(v) => dispatch({ type: "travels", value: v })}>
        Готов выезжать на объекты в другие регионы
      </Checkbox>
    </>
  );
}
