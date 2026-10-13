import { BadgeCodesPicker } from "@/source/entities/expertise";
import type { OrderFormProps } from "../model/types";
import { FormSection } from "./FormSection";
import s from "./BadgesField.module.scss";

interface BadgesFieldProps extends OrderFormProps {
  onShowHelp: () => void;
}

/** Коды областей аттестации, которые требуются от исполнителя экспертизы. */
export function BadgesField({ state, dispatch, onShowHelp }: BadgesFieldProps) {
  return (
    <FormSection>
      <h3 className={s.title}>
        Буквенно-цифровые обозначения областей аттестации исполнителей в области промышленной безопасности{" "}
        <button type="button" className={s.helpTrigger} onClick={onShowHelp}>
          (Что это?)
        </button>
      </h3>
      <BadgeCodesPicker value={state.badgeCodes} onChange={(value) => dispatch({ type: "badgeCodes", value })} resultLabel="Будут добавлены к заказу" />
    </FormSection>
  );
}
