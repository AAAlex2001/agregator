"use client";

import { ALL_BADGE_CODES_SET, BadgeCodesPicker } from "@/source/entities/expertise";
import {
  ORDER_WORK_GROUPS,
  SUBSCRIPTION_WORK_OPTIONS,
  subscriptionWorkOptionsOf,
} from "@/source/entities/order";
import { Switch } from "@/source/shared/ui/Switch";
import s from "./OrderNotificationTypesPicker.module.scss";

const WORK_TYPE_CODES: ReadonlySet<string> = new Set(
  SUBSCRIPTION_WORK_OPTIONS.map((option) => option.value),
);

interface Props {
  value: string[];
  onChange: (types: string[]) => void;
  disabled?: boolean;
}

export function OrderNotificationTypesPicker({
  value,
  onChange,
  disabled = false,
}: Props) {
  const badgeCodes = value.filter((item) => ALL_BADGE_CODES_SET.has(item));
  const workTypes = value.filter((item) => WORK_TYPE_CODES.has(item));

  const replace = (nextBadgeCodes: string[], nextWorkTypes: string[]) => {
    onChange([...nextBadgeCodes, ...nextWorkTypes]);
  };

  const toggleWorkType = (code: string, enabled: boolean) => {
    replace(
      badgeCodes,
      enabled ? [...workTypes, code] : workTypes.filter((item) => item !== code),
    );
  };

  return (
    <fieldset className={disabled ? s.disabled : s.picker} disabled={disabled}>
      <section className={s.section}>
        <h4 className={s.heading}>Экспертиза промышленной безопасности</h4>
        <BadgeCodesPicker value={badgeCodes} onChange={(next) => replace(next, workTypes)} />
      </section>

      {ORDER_WORK_GROUPS.map((group) => (
        <section key={group.key} className={s.section}>
          <h4 className={s.heading}>{group.title}</h4>
          <ul className={s.engineeringList}>
            {subscriptionWorkOptionsOf(group.key).map((option) => (
              <li key={option.value} className={s.engineeringItem}>
                <Switch
                  id={`order-notification-${option.value.toLowerCase()}`}
                  checked={workTypes.includes(option.value)}
                  onChange={(next) => toggleWorkType(option.value, next)}
                  label={option.label}
                  description={option.description}
                  disabled={disabled}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </fieldset>
  );
}
