"use client";

import { AuditExpertProfileFields, useAuditExpertProfile } from "@/entities/audit";
import type { AuditOptions } from "@/entities/audit";
import { Button } from "@/shared/ui/button";
import { useAuditProfileForm } from "../../model/use-audit-profile-form";
import { AuditDocuments } from "../audit-documents";
import styles from "./style.module.scss";

/** Справочники областей аттестации и квалификаций аудитора. */
interface AuditProfileFormProps {
  options: AuditOptions;
}

/** Собирает сведения, документы и сохранение анкеты аудитора. */
export function AuditProfileForm({ options }: AuditProfileFormProps) {
  const { fields, change, save } = useAuditProfileForm();
  const { operation } = useAuditExpertProfile();
  const isBusy = operation !== "idle";

  return (
    <div className={styles.card}>
      <fieldset
        className={styles.fields}
        disabled={isBusy}
      >
        <AuditExpertProfileFields
          value={fields}
          options={options}
          onChange={change}
        />
        <AuditDocuments />
      </fieldset>

      <Button
        variant="chat"
        size="md"
        fullWidth
        isLoading={operation === "saving"}
        disabled={isBusy}
        onClick={save}
      >
        Сохранить анкету
      </Button>
    </div>
  );
}
