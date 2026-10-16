"use client";

import { ForensicProfileFields, useForensicProfile } from "@/entities/forensic";
import { Button } from "@/shared/ui/button";
import { useForensicProfileForm } from "../../model/use-forensic-profile-form";
import { ForensicDiploma } from "../forensic-diploma";
import { ForensicDocuments } from "../forensic-documents";
import styles from "./style.module.scss";

/** Собирает поля, документы и сохранение анкеты судебного эксперта. */
export function ForensicProfileForm() {
  const { fields, change, save } = useForensicProfileForm();
  const { operation } = useForensicProfile();
  const isBusy = operation !== "idle";

  return (
    <div className={styles.card}>
      <fieldset
        className={styles.fields}
        disabled={isBusy}
      >
        <ForensicProfileFields
          value={fields}
          onChange={change}
        />
        <ForensicDiploma />
        <ForensicDocuments />
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
