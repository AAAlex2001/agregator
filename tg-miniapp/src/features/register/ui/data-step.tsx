import { type Dispatch } from "react";
import { Checkbox } from "@/shared/ui";
import { type Role } from "@/shared/services/api";
import { type RegisterAction, type RegisterState } from "../model/reducer";
import { AccountFields } from "./fields/account-fields";
import { CustomerFields } from "./fields/customer-fields";
import { ExpertFields } from "./fields/expert-fields";
import { LicenseFields } from "./fields/license-fields";
import s from "./register-sheet.module.scss";

interface Props {
  role: Role;
  isLicense: boolean;
  state: RegisterState;
  dispatch: Dispatch<RegisterAction>;
}

export function DataStep({ role, isLicense, state, dispatch }: Props) {
  return (
    <div className={s.form}>
      {role === "EXPERT" && <ExpertFields state={state} dispatch={dispatch} />}
      {role === "CUSTOMER" && <CustomerFields state={state} dispatch={dispatch} />}
      {isLicense && <LicenseFields state={state} dispatch={dispatch} />}

      <AccountFields state={state} dispatch={dispatch} phoneRequired={isLicense} />

      <Checkbox checked={state.agree} onChange={(v) => dispatch({ type: "agree", value: v })}>
        Принимаю условия использования и политику конфиденциальности
      </Checkbox>
    </div>
  );
}
