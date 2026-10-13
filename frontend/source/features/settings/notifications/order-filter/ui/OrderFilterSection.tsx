"use client";

import { ALL_BADGE_CODES_SET, BadgeCodesPicker } from "@/source/entities/expertise";
import { SUBSCRIPTION_WORK_OPTIONS } from "@/source/entities/order";
import { FormSection } from "@/source/shared/ui";
import { Switch } from "@/source/shared/ui/Switch";
import { useOrderFilter } from "../model/useOrderFilter";
import s from "./OrderFilterSection.module.scss";

const WORK_TYPES: string[] = SUBSCRIPTION_WORK_OPTIONS.map((option) => option.value);

interface OrderFilterSectionProps {
  orderTypes: string[];
}

/** Блок «Новые заказы» исполнителя: коды экспертизы и направления, по которым приходят письма о заказах. */
export function OrderFilterSection({ orderTypes }: OrderFilterSectionProps) {
  const { isSaving, change } = useOrderFilter();
  const badgeCodes = orderTypes.filter((code) => ALL_BADGE_CODES_SET.has(code));
  const workTypes = orderTypes.filter((code) => WORK_TYPES.includes(code));

  const toggleWorkType = (code: string, enabled: boolean) =>
    change([...badgeCodes, ...(enabled ? [...workTypes, code] : workTypes.filter((item) => item !== code))]);

  return (
    <FormSection
      title="Новые заказы"
      hint="Уведомление придёт только по заказам, попадающим под ваши требования. Пока ничего не выбрано, уведомления о новых заказах не приходят."
      collapsible
    >
      <fieldset className={s.picker} disabled={isSaving}>
        <section className={s.section}>
          <h4 className={s.heading}>Экспертиза промышленной безопасности</h4>
          <BadgeCodesPicker value={badgeCodes} onChange={(codes) => change([...codes, ...workTypes])} />
        </section>

        <section className={s.section}>
          <h4 className={s.heading}>Направления</h4>
          <ul className={s.list}>
            {SUBSCRIPTION_WORK_OPTIONS.map((option) => (
              <li key={option.value} className={s.item}>
                <Switch
                  id={`order-notification-${option.value.toLowerCase()}`}
                  checked={workTypes.includes(option.value)}
                  onChange={(enabled) => toggleWorkType(option.value, enabled)}
                  label={option.label}
                  description={option.description}
                  disabled={isSaving}
                />
              </li>
            ))}
          </ul>
        </section>
      </fieldset>
    </FormSection>
  );
}
