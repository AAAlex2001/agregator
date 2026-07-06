import { Field, Select, TextField } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import { CompanySuggest } from "@/entites/party";
import { type RentalKind } from "@/entites/registration";
import { TYPES } from "@/entites/expertise";
import { type StepProps } from "./types";

const AREAS = TYPES.map((v) => ({ key: v, label: v }));

const RENTAL: { key: RentalKind; label: string }[] = [
  { key: "PERCENT", label: "% от договора" },
  { key: "FIXED", label: "Фикс. цена" },
  { key: "NEGOTIABLE", label: "Договорная" },
];

const onlyDigits = (v: string) => v.replace(/\D/g, "");

export function LicenseStep({ state, dispatch }: StepProps) {
  return (
    <>
      <Field label="Организация">
        <CompanySuggest
          value={state.companyName}
          onChangeText={(v) => dispatch({ type: "companyText", value: v })}
          onPick={(party) => dispatch({ type: "party", party })}
        />
      </Field>

      <TextField
        label="Номер лицензии"
        placeholder="Номер лицензии ЭПБ ОПО"
        value={state.licenseNumber}
        onChange={(e) => dispatch({ type: "set", key: "licenseNumber", value: e.target.value })}
      />

      <Field label="Области экспертизы">
        <Select
          multi
          title="Области экспертизы"
          options={AREAS}
          value={state.licenseAreas}
          placeholder="Выберите области"
          onChange={(v) => dispatch({ type: "areas", value: v })}
        />
      </Field>

      <Field label="Условия предоставления лицензии">
        <Tabs
          tabs={RENTAL}
          active={state.rentalKind}
          onChange={(k) => dispatch({ type: "rentalKind", value: k as RentalKind })}
        />
        {state.rentalKind === "PERCENT" ? (
          <TextField
            inputMode="numeric"
            placeholder="Процент от суммы договора, %"
            value={state.rentalPercent}
            onChange={(e) => {
              const digits = onlyDigits(e.target.value);
              dispatch({
                type: "set",
                key: "rentalPercent",
                value: digits === "" ? "" : String(Math.min(100, Number(digits))),
              });
            }}
          />
        ) : null}
        {state.rentalKind === "FIXED" ? (
          <TextField
            inputMode="numeric"
            placeholder="Минимальная цена, ₽"
            value={state.rentalFixed}
            onChange={(e) => dispatch({ type: "set", key: "rentalFixed", value: onlyDigits(e.target.value) })}
          />
        ) : null}
      </Field>
    </>
  );
}
