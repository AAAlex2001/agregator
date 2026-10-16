"use client";

import { AuditCustomerProfileFields } from "@/entities/audit";
import type { AuditCustomerProfileValues } from "@/entities/audit";
import { Button } from "@/shared/ui/button";
import { useAuditCustomerProfileForm } from "../../model/use-audit-customer-profile-form";
import styles from "./style.module.scss";

/** Сохранённые сведения заказчика для начала редактирования. */
interface AuditCustomerProfileFormProps {
  initialProfile: AuditCustomerProfileValues;
}

/** Собирает поля и сохранение анкеты заказчика аудита. */
export function AuditCustomerProfileForm({
  initialProfile,
}: AuditCustomerProfileFormProps) {
  const {
    fields,
    isSaving,
    change,
    save,
  } = useAuditCustomerProfileForm(initialProfile);

  return (
    <div className={styles.card}>
      <fieldset
        className={styles.fields}
        disabled={isSaving}
      >
        <AuditCustomerProfileFields
          value={fields}
          onChange={change}
        />
      </fieldset>

      <Button
        variant="chat"
        size="md"
        fullWidth
        isLoading={isSaving}
        disabled={isSaving}
        onClick={save}
      >
        Сохранить анкету
      </Button>
    </div>
  );
}
