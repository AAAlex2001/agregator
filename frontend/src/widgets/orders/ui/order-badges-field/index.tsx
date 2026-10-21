"use client";

import { ExpertiseCodesPicker } from "@/entities/expertise";
import { useOrderForm } from "@/entities/order";
import { FormSection } from "@/shared/ui/form-section";
import styles from "./style.module.scss";

/** Что выбирает заказчик на шаге. */
const BADGES_HINT = "Буквенно-цифровые обозначения областей аттестации исполнителей "
  + "в области промышленной безопасности";

/** Переход к справке по кодам, которые заказчик требует от исполнителя. */
interface OrderBadgesFieldProps {
  onShowHelp: () => void;
}

/** Связывает выбор областей аттестации с требованиями создаваемого заказа. */
export function OrderBadgesField({ onShowHelp }: OrderBadgesFieldProps) {
  const { values, dispatch } = useOrderForm();

  return (
    <FormSection
      title="Области аттестации"
      hint={BADGES_HINT}
    >
      <button
        type="button"
        className={styles.helpTrigger}
        onClick={onShowHelp}
      >
        Что означают обозначения?
      </button>
      <ExpertiseCodesPicker
        value={values.badgeCodes}
        onChange={(codes) => dispatch({ type: "badges/changed", codes })}
        resultLabel="Будут добавлены к заказу"
      />
    </FormSection>
  );
}
