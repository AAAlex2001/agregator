import type { AuditCustomerProfileValues } from "@/entities/audit";
import type { DirectionCode } from "@/entities/direction";

/** Направления заказчика; для аудита дополнительно заполняются должность и лицензия ОПО. */
export interface CustomerRegistration {
  directions: DirectionCode[];
  audit: AuditCustomerProfileValues | null;
}

/** Создаёт анкету заказчика без выбранных направлений. */
export function createCustomerRegistration(): CustomerRegistration {
  return {
    directions: [],
    audit: null,
  };
}

