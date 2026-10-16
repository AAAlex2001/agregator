"use client";

import { ExpertiseCodesPicker } from "@/entities/expertise";
import { OrderFormSection, useOrderForm } from "@/entities/order";
import styles from "./style.module.scss";

/** Переход к справке по кодам, которые заказчик требует от исполнителя. */
interface OrderBadgesFieldProps {
  onShowHelp: () => void;
}

/** Связывает выбор областей аттестации с требованиями создаваемого заказа. */
export function OrderBadgesField({ onShowHelp }: OrderBadgesFieldProps) {
  const { values, dispatch } = useOrderForm();

  /** Сохраняет выбранные коды аттестации исполнителей. */
  function changeBadges(codes: string[]) {
    dispatch({
      type: "badges/changed",
      codes,
    });
  }

  return (
    <OrderFormSection>
      <h3 className={styles.title}>
        Буквенно-цифровые обозначения областей аттестации исполнителей
        в области промышленной безопасности{" "}
        <button
          type="button"
          className={styles.helpTrigger}
          onClick={onShowHelp}
        >
          (Что это?)
        </button>
      </h3>
      <ExpertiseCodesPicker
        value={values.badgeCodes}
        onChange={changeBadges}
        resultLabel="Будут добавлены к заказу"
      />
    </OrderFormSection>
  );
}
