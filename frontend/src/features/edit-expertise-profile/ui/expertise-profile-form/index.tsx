"use client";

import { ExpertiseProfileFields } from "@/entities/expertise";
import type { ExpertiseProfileValues } from "@/entities/expertise";
import { Button } from "@/shared/ui/button";
import { useExpertiseProfileForm } from "../../model/use-expertise-profile-form";
import styles from "./style.module.scss";

/** Сохранённые удостоверения эксперта для начала редактирования. */
interface ExpertiseProfileFormProps {
  initialProfile: ExpertiseProfileValues;
}

/** Собирает редактирование удостоверений и сохранение анкеты эксперта. */
export function ExpertiseProfileForm({
  initialProfile,
}: ExpertiseProfileFormProps) {
  const {
    fields,
    isSaving,
    change,
    save,
  } = useExpertiseProfileForm(initialProfile);

  return (
    <div className={styles.card}>
      <fieldset
        className={styles.fields}
        disabled={isSaving}
      >
        <ExpertiseProfileFields
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
