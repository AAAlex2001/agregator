"use client";

import { AuditHolderProfileFields } from "@/entities/audit";
import type {
  AuditHolderProfileValues,
  AuditOptions,
} from "@/entities/audit";
import { Button } from "@/shared/ui/button";
import { useAuditHolderProfileForm } from "../../model/use-audit-holder-profile-form";
import styles from "./style.module.scss";

/** Сохранённая анкета и варианты областей аккредитации инспекционного органа. */
interface AuditHolderProfileFormProps {
  initialProfile: AuditHolderProfileValues;
  options: AuditOptions;
}

/** Собирает поля и сохранение анкеты инспекционного органа. */
export function AuditHolderProfileForm({
  initialProfile,
  options,
}: AuditHolderProfileFormProps) {
  const {
    fields,
    isSaving,
    change,
    save,
  } = useAuditHolderProfileForm(initialProfile);

  return (
    <div className={styles.card}>
      <fieldset
        className={styles.fields}
        disabled={isSaving}
      >
        <AuditHolderProfileFields
          value={fields}
          options={options}
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
