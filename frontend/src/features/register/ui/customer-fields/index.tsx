import {
  AuditCustomerProfileFields,
  createAuditCustomerProfileValues,
} from "@/entities/audit";
import { DIRECTIONS } from "@/entities/direction";
import type { CustomerRegistration } from "../../model/customer";
import { DirectionList } from "../direction-list";
import { DirectionOption } from "../direction-option";

/** Выбранные направления заказчика и анкета аудита СУПБ. */
interface CustomerFieldsProps {
  value: CustomerRegistration;
  onChange: (value: CustomerRegistration) => void;
}

/** Показывает направления заказчика с дополнительными полями для аудита. */
export function CustomerFields({ value, onChange }: CustomerFieldsProps) {
  return (
    <DirectionList>
      {DIRECTIONS.map((direction) => (
        direction.value === "AUDIT_SUPB" ? (
          <DirectionOption
            key={direction.value}
            id={direction.value}
            title={direction.label}
            description={direction.description}
            checked={value.audit !== null}
            onToggle={() => onChange({
              ...value,
              audit: value.audit ? null : createAuditCustomerProfileValues(),
            })}
          >
            {value.audit && (
              <AuditCustomerProfileFields
                value={value.audit}
                onChange={(audit) => onChange({ ...value, audit })}
              />
            )}
          </DirectionOption>
        ) : (
          <DirectionOption
            key={direction.value}
            id={direction.value}
            title={direction.label}
            description={direction.description}
            checked={value.directions.includes(direction.value)}
            onToggle={() => onChange({
              ...value,
              directions: value.directions.includes(direction.value)
                ? value.directions.filter((code) => code !== direction.value)
                : [...value.directions, direction.value],
            })}
          />
        )
      ))}
    </DirectionList>
  );
}

