import { Checkbox } from "@/source/shared/ui/Checkbox";
import type { OrderFormProps } from "../model/types";
import { FormSection } from "./FormSection";
import s from "./RequirementsField.module.scss";

export function RequirementsField({ state, dispatch }: OrderFormProps) {
  return (
    <FormSection label={<span className={s.title}>Требования к исполнителю</span>}>
      <div className={s.options}>
        <Checkbox id="order-requires-expert" checked={state.requiresExpert} onChange={(value) => dispatch({ type: "requiresExpert", value })}>
          Требуется исполнитель?
        </Checkbox>
        <Checkbox id="order-requires-license" checked={state.requiresLicense} onChange={(value) => dispatch({ type: "requiresLicense", value })}>
          Требуется лицензия?
        </Checkbox>
      </div>
    </FormSection>
  );
}
