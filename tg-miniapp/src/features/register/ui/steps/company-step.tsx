import { Field } from "@/shared/ui";
import { CompanySuggest } from "@/entites/party";
import { type StepProps } from "./types";

export function CompanyStep({ state, dispatch }: StepProps) {
  return (
    <Field label="Организация">
      <CompanySuggest
        value={state.companyName}
        onChangeText={(v) => dispatch({ type: "companyText", value: v })}
        onPick={(party) => dispatch({ type: "party", party })}
      />
    </Field>
  );
}
