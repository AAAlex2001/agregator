import type { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import type { OrderFormValues } from "../../../model/schema";
import base from "./sectionBase.module.scss";
import s from "./requirementsSection.module.scss";

interface Props {
  form: UseFormReturn<OrderFormValues>;
}

export function RequirementsSection({ form }: Props) {
  const { watch, setValue, formState } = form;
  const error = formState.errors.requiresExpert?.message ?? formState.errors.requiresLicense?.message;

  return (
    <section className={base.section}>
      <span className={base.label}>Требования к исполнителю</span>
      <div className={s.options}>
        <Checkbox
          id="order-requires-expert"
          checked={watch("requiresExpert")}
          onChange={(checked) => setValue("requiresExpert", checked, { shouldDirty: true, shouldValidate: true })}
          error={error}
        >
          Требуется эксперт?
        </Checkbox>
        <Checkbox
          id="order-requires-license"
          checked={watch("requiresLicense")}
          onChange={(checked) => setValue("requiresLicense", checked, { shouldDirty: true, shouldValidate: true })}
          error={error}
        >
          Требуется лицензия?
        </Checkbox>
      </div>
    </section>
  );
}
