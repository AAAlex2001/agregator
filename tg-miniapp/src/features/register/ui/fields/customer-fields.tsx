import { type Dispatch } from "react";
import { CompanySuggest } from "@/entites/party";
import { type RegisterAction, type RegisterState } from "../../model/reducer";
import s from "../register-sheet.module.scss";

interface Props {
  state: RegisterState;
  dispatch: Dispatch<RegisterAction>;
}

export function CustomerFields({ state, dispatch }: Props) {
  return (
    <div className={s.field}>
      <span className={s.label}>Организация</span>
      <CompanySuggest
        value={state.companyName}
        onChangeText={(v) => dispatch({ type: "set", key: "companyName", value: v })}
        onPick={(party) => dispatch({ type: "party", party })}
      />
    </div>
  );
}
