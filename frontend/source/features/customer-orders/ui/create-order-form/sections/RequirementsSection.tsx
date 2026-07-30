import type { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import { ORDER_WORK_OPTIONS, type OrderWorkType } from "@/source/entities/order";
import type { OrderFormValues } from "../../../model/schema";
import base from "./sectionBase.module.scss";
import s from "./requirementsSection.module.scss";

interface Props {
  form: UseFormReturn<OrderFormValues>;
}

export function RequirementsSection({ form }: Props) {
  const { watch, setValue, formState } = form;
  const error = formState.errors.requiresExpert?.message ?? formState.errors.requiresLicense?.message;
  const workType = watch("workType");

  const chooseWorkType = (value: OrderWorkType) => {
    setValue("workType", value, { shouldDirty: true, shouldValidate: true });
    if (value !== "EXPERTISE") {
      setValue("selectionsByType", {}, { shouldDirty: true });
    }
  };

  return (
    <section className={base.section}>
      <span className={`${base.label} ${s.title}`}>Вид работ</span>
      <div className={s.modeOptions}>
        <button
          type="button"
          className={`${s.modeButton} ${workType === "EXPERTISE" ? s.modeButtonActive : ""}`}
          onClick={() => chooseWorkType("EXPERTISE")}
        >
          Экспертиза
        </button>
        <button
          type="button"
          className={`${s.modeButton} ${workType !== "EXPERTISE" ? s.modeButtonActive : ""}`}
          onClick={() => chooseWorkType(workType === "EXPERTISE" ? "DESIGN_SURVEY" : workType)}
        >
          Иная инженерная работа
        </button>
      </div>

      {workType !== "EXPERTISE" && (
        <div className={s.workOptions}>
          {ORDER_WORK_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${s.workOption} ${workType === option.value ? s.workOptionActive : ""}`}
              onClick={() => chooseWorkType(option.value)}
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>
      )}
      <span className={`${base.label} ${s.title}`}>Требования к исполнителю</span>
      <div className={s.options}>
        <Checkbox
          id="order-requires-expert"
          checked={watch("requiresExpert")}
          onChange={(checked) => setValue("requiresExpert", checked, { shouldDirty: true, shouldValidate: true })}
          error={error}
        >
          Требуется исполнитель?
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
