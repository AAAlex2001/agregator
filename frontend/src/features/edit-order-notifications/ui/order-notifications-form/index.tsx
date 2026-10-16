"use client";

import { ExpertiseCodesPicker } from "@/entities/expertise";
import { FormSection } from "@/shared/ui/form-section";
import { NOTIFICATION_DIRECTIONS } from "../../model/directions";
import type { OrderNotificationsOptions } from "../../model/types";
import { useEditOrderNotifications } from "../../model/use-edit-order-notifications";
import { DirectionNotificationOption } from "../direction-notification-option";
import styles from "./style.module.scss";

/** Пояснение, когда приходят письма о новых заказах. */
const SECTION_HINT =
  "Уведомление придёт только по заказам, попадающим под ваши требования. "
  + "Пока ничего не выбрано, уведомления о новых заказах не приходят.";

/** Сохранённый фильтр писем и блокировка соседних настроек. */
interface OrderNotificationsFormProps extends OrderNotificationsOptions {
  orderTypes: string[];
}

/** Выбирает требования и направления, по которым приходят письма о заказах. */
export function OrderNotificationsForm({
  orderTypes,
  disabled = false,
  onBusyChange,
}: OrderNotificationsFormProps) {
  const {
    expertiseCodes,
    directions,
    isSaving,
    changeExpertiseCodes,
    changeDirection,
  } = useEditOrderNotifications(orderTypes, {
    disabled,
    onBusyChange,
  });
  const isDisabled = disabled || isSaving;

  return (
    <FormSection
      title="Новые заказы"
      hint={SECTION_HINT}
      collapsible
    >
      <fieldset
        className={styles.picker}
        disabled={isDisabled}
      >
        <section className={styles.section}>
          <h4 className={styles.heading}>
            Экспертиза промышленной безопасности
          </h4>
          <ExpertiseCodesPicker
            value={expertiseCodes}
            onChange={changeExpertiseCodes}
          />
        </section>

        <section className={styles.section}>
          <h4 className={styles.heading}>Направления</h4>
          <ul className={styles.list}>
            {NOTIFICATION_DIRECTIONS.map((direction) => (
              <DirectionNotificationOption
                key={direction.value}
                direction={direction}
                checked={directions.includes(direction.value)}
                disabled={isDisabled}
                onChange={changeDirection}
              />
            ))}
          </ul>
        </section>
      </fieldset>
    </FormSection>
  );
}
