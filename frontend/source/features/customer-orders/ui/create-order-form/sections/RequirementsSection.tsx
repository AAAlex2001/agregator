import { Checkbox } from "@/source/shared/ui/Checkbox";
import type { StepProps } from "./types";
import base from "./sectionBase.module.scss";
import s from "./requirementsSection.module.scss";

export function RequirementsSection({ state, dispatch }: StepProps) {
  return (
    <section className={base.section}>
      <span className={`${base.label} ${s.title}`}>Требования к исполнителю</span>
      <div className={s.options}>
        <Checkbox
          id="order-requires-expert"
          checked={state.requiresExpert}
          onChange={(value) => dispatch({ type: "requiresExpert", value })}
        >
          Требуется исполнитель?
        </Checkbox>
        <Checkbox
          id="order-requires-license"
          checked={state.requiresLicense}
          onChange={(value) => dispatch({ type: "requiresLicense", value })}
        >
          Требуется лицензия?
        </Checkbox>
      </div>
    </section>
  );
}
