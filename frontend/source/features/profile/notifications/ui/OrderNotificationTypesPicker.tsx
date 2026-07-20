"use client";

import { BadgeCodesPicker } from "@/source/entities/expertise";
import {
  ORDER_WORK_OPTIONS,
  type OrderWorkType,
} from "@/source/entities/order";
import { Switch } from "@/source/shared/ui/Switch";
import s from "./OrderNotificationTypesPicker.module.scss";

type EngineeringWorkType = Exclude<OrderWorkType, "EXPERTISE">;

interface Props {
  value: string[];
  onChange: (types: string[]) => void;
  disabled?: boolean;
}

function isEngineeringWorkType(value: string): value is EngineeringWorkType {
  return ORDER_WORK_OPTIONS.some((option) => option.value === value);
}

export function OrderNotificationTypesPicker({
  value,
  onChange,
  disabled = false,
}: Props) {
  const engineeringTypes = value.filter(isEngineeringWorkType);
  const badgeCodes = value.filter((item) => !isEngineeringWorkType(item));

  const replaceBadgeCodes = (nextBadgeCodes: string[]) => {
    onChange([...nextBadgeCodes, ...engineeringTypes]);
  };

  const toggleEngineeringType = (
    workType: EngineeringWorkType,
    enabled: boolean,
  ) => {
    const next = enabled
      ? [...value, workType]
      : value.filter((item) => item !== workType);
    onChange(Array.from(new Set(next)));
  };

  return (
    <fieldset className={disabled ? s.disabled : s.picker} disabled={disabled}>
      <section className={s.section}>
        <h4 className={s.heading}>Экспертиза промышленной безопасности</h4>
        <BadgeCodesPicker value={badgeCodes} onChange={replaceBadgeCodes} />
      </section>

      <section className={s.section}>
        <h4 className={s.heading}>Иные инженерные работы</h4>
        <ul className={s.engineeringList}>
          {ORDER_WORK_OPTIONS.map((option) => (
            <li key={option.value} className={s.engineeringItem}>
              <Switch
                id={`order-notification-${option.value.toLowerCase()}`}
                checked={engineeringTypes.includes(option.value)}
                onChange={(next) => toggleEngineeringType(option.value, next)}
                label={option.label}
                description={option.description}
                disabled={disabled}
              />
            </li>
          ))}
        </ul>
      </section>
    </fieldset>
  );
}
