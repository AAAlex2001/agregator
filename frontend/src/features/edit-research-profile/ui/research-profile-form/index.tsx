"use client";

import { ResearchProfileFields, useResearchProfile } from "@/entities/research";
import type { ResearchOptions } from "@/entities/research";
import { Button } from "@/shared/ui/button";
import { useResearchProfileForm } from "../../model/use-research-profile-form";
import styles from "./style.module.scss";

/** Справочники для редактирования научной квалификации. */
interface ResearchProfileFormProps {
  options: ResearchOptions;
}

/** Даёт изменить научную квалификацию и сохранить анкету. */
export function ResearchProfileForm({ options }: ResearchProfileFormProps) {
  const { fields, change, save } = useResearchProfileForm();
  const { isSaving } = useResearchProfile();

  return (
    <div className={styles.card}>
      <ResearchProfileFields
        value={fields}
        options={options}
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
