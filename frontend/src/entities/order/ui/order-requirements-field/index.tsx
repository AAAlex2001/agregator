"use client";

import { Checkbox } from "@/shared/ui/checkbox";
import { useOrderForm } from "../../model/order-form-provider";
import { OrderFormSection } from "../order-form-section";
import styles from "./style.module.scss";

/** Позволяет запросить исполнителя, лицензию или оба варианта для экспертизы. */
export function OrderRequirementsField() {
  const { values, dispatch } = useOrderForm();

  /** Обновляет необходимость исполнителя в заказе. */
  function changeExpertRequirement(isRequired: boolean) {
    dispatch({
      type: "expert/changed",
      isRequired,
    });
  }

  /** Обновляет необходимость лицензии в заказе. */
  function changeLicenseRequirement(isRequired: boolean) {
    dispatch({
      type: "license/changed",
      isRequired,
    });
  }

  return (
    <OrderFormSection
      label={<span className={styles.title}>Требования к исполнителю</span>}
    >
      <div className={styles.options}>
        <Checkbox
          id="order-requires-expert"
          checked={values.requiresExpert}
          onChange={changeExpertRequirement}
        >
          Требуется исполнитель?
        </Checkbox>

        <Checkbox
          id="order-requires-license"
          checked={values.requiresLicense}
          onChange={changeLicenseRequirement}
        >
          Требуется лицензия?
        </Checkbox>
      </div>
    </OrderFormSection>
  );
}
