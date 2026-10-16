"use client";

import { LaboratoryProfileFields, useLaboratoryProfile } from "@/entities/laboratory";
import { Button } from "@/shared/ui/button";
import { useLaboratoryProfileForm } from "../../model/use-laboratory-profile-form";
import styles from "./style.module.scss";

/** Даёт изменить и сохранить сведения лаборатории. */
export function LaboratoryProfileForm() {
  const { fields, change, save } = useLaboratoryProfileForm();
  const { isSaving } = useLaboratoryProfile();

  return (
    <div className={styles.card}>
      <LaboratoryProfileFields
        value={fields}
        onChange={change}
        disabled={isSaving}
      />

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
