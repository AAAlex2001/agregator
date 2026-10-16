"use client";

import { SurveyProfileFields, useSurveyProfile } from "@/entities/survey";
import type { SurveyOptions } from "@/entities/survey";
import { Button } from "@/shared/ui/button";
import { useSurveyProfileForm } from "../../model/use-survey-profile-form";
import { SurveyDocuments } from "../survey-documents";
import styles from "./style.module.scss";

/** Справочники видов изысканий и областей аттестации РТН. */
interface SurveyProfileFormProps {
  options: SurveyOptions;
}

/** Собирает сведения, пять групп документов и сохранение анкеты изыскателя. */
export function SurveyProfileForm({ options }: SurveyProfileFormProps) {
  const { fields, change, save } = useSurveyProfileForm();
  const { operation } = useSurveyProfile();
  const isBusy = operation !== "idle";

  return (
    <div className={styles.card}>
      <fieldset
        className={styles.fields}
        disabled={isBusy}
      >
        <SurveyProfileFields
          value={fields}
          options={options}
          onChange={change}
        />
        <SurveyDocuments />
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
