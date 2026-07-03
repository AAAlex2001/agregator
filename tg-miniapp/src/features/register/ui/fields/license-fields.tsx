import { type Dispatch } from "react";
import { Chips, TextField } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import { CompanySuggest } from "@/entites/party";
import { type RentalKind } from "../../model/api";
import { type RegisterAction, type RegisterState } from "../../model/reducer";
import s from "../register-sheet.module.scss";

const AREAS = ["КЛ", "ТП", "КЛ/ТП", "ЗС", "ТУ", "Д", "ОБ"].map((area) => ({ key: area, label: area }));

const RENTAL: { key: RentalKind; label: string }[] = [
  { key: "PERCENT", label: "% от договора" },
  { key: "FIXED", label: "Фикс. цена" },
  { key: "NEGOTIABLE", label: "Договорная" },
];

interface Props {
  state: RegisterState;
  dispatch: Dispatch<RegisterAction>;
}

export function LicenseFields({ state, dispatch }: Props) {
  return (
    <>
      <div className={s.field}>
        <span className={s.label}>Организация</span>
        <CompanySuggest
          value={state.companyName}
          onChangeText={(v) => dispatch({ type: "set", key: "companyName", value: v })}
          onPick={(party) => dispatch({ type: "party", party })}
        />
      </div>

      <TextField
        label="Номер лицензии"
        placeholder="Номер лицензии ЭПБ ОПО"
        value={state.licenseNumber}
        onChange={(e) => dispatch({ type: "set", key: "licenseNumber", value: e.target.value })}
      />

      <div className={s.field}>
        <span className={s.label}>Области экспертизы</span>
        <Chips options={AREAS} value={state.licenseAreas} onToggle={(area) => dispatch({ type: "toggleArea", area })} />
      </div>

      <div className={s.field}>
        <span className={s.label}>Условия предоставления лицензии</span>
        <Tabs
          tabs={RENTAL.map((r) => ({ key: r.key, label: r.label }))}
          active={state.rentalKind}
          onChange={(k) => dispatch({ type: "rentalKind", value: k as RentalKind })}
        />
        {state.rentalKind === "PERCENT" && (
          <TextField
            inputMode="numeric"
            placeholder="Процент от суммы договора"
            value={state.rentalPercent}
            onChange={(e) => dispatch({ type: "set", key: "rentalPercent", value: e.target.value })}
          />
        )}
        {state.rentalKind === "FIXED" && (
          <TextField
            inputMode="numeric"
            placeholder="Минимальная цена, ₽"
            value={state.rentalFixed}
            onChange={(e) => dispatch({ type: "set", key: "rentalFixed", value: e.target.value })}
          />
        )}
      </div>
    </>
  );
}
