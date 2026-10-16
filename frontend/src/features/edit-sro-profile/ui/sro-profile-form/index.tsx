"use client";

import { SroProfileFields, useSroProfile } from "@/entities/sro";
import { Button } from "@/shared/ui/button";
import { useSroProfileForm } from "../../model/use-sro-profile-form";
import { SroDocuments } from "../sro-documents";
import styles from "./style.module.scss";

/** Собирает сведения, дополнительные документы и сохранение анкеты члена СРО. */
export function SroProfileForm() {
  const { fields, change, save } = useSroProfileForm();
  const { direction, operation } = useSroProfile();
  const isBusy = operation !== "idle";

  return (
    <div className={styles.card}>
      <fieldset
        className={styles.fields}
        disabled={isBusy}
      >
        <SroProfileFields
          direction={direction}
          value={fields}
          onChange={change}
        />
        <SroDocuments />
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
