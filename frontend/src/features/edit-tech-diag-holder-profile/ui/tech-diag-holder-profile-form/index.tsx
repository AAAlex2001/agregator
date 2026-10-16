"use client";

import { TechDiagHolderProfileFields } from "@/entities/tech-diag";
import type {
  TechDiagHolderProfile,
  TechDiagOptions,
} from "@/entities/tech-diag";
import { Button } from "@/shared/ui/button";
import { useTechDiagHolderProfileForm } from "../../model/use-tech-diag-holder-profile-form";
import styles from "./style.module.scss";

/** Сохранённая анкета лаборатории и варианты видов контроля. */
interface TechDiagHolderProfileFormProps {
  initialProfile: TechDiagHolderProfile;
  options: TechDiagOptions;
}

/** Собирает поля и сохранение анкеты лаборатории неразрушающего контроля. */
export function TechDiagHolderProfileForm({
  initialProfile,
  options,
}: TechDiagHolderProfileFormProps) {
  const {
    fields,
    isSaving,
    change,
    save,
  } = useTechDiagHolderProfileForm(initialProfile);

  return (
    <div className={styles.card}>
      <fieldset
        className={styles.fields}
        disabled={isSaving}
      >
        <TechDiagHolderProfileFields
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
