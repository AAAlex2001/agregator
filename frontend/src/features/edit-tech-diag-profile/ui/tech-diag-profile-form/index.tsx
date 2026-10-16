"use client";

import { TechDiagProfileFields, useTechDiagProfile } from "@/entities/tech-diag";
import type { TechDiagOptions } from "@/entities/tech-diag";
import { Button } from "@/shared/ui/button";
import { useTechDiagProfileForm } from "../../model/use-tech-diag-profile-form";
import { TechDiagDocuments } from "../tech-diag-documents";
import styles from "./style.module.scss";

/** Справочники видов и объектов неразрушающего контроля. */
interface TechDiagProfileFormProps {
  options: TechDiagOptions;
}

/** Собирает сведения, удостоверения и сохранение анкеты специалиста НК. */
export function TechDiagProfileForm({ options }: TechDiagProfileFormProps) {
  const { fields, change, save } = useTechDiagProfileForm();
  const { operation } = useTechDiagProfile();
  const isBusy = operation !== "idle";

  return (
    <div className={styles.card}>
      <fieldset
        className={styles.fields}
        disabled={isBusy}
      >
        <TechDiagProfileFields
          value={fields}
          options={options}
          onChange={change}
        />
        <TechDiagDocuments />
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
