"use client";

import { EcologyProfileFields, useEcologyProfile } from "@/entities/ecology";
import type { EcologyOptions } from "@/entities/ecology";
import { Button } from "@/shared/ui/button";
import { useEcologyProfileForm } from "../../model/use-ecology-profile-form";
import { EcologyDocuments } from "../ecology-documents";
import styles from "./style.module.scss";

/** Доступные виды экологических работ для заполнения анкеты. */
interface EcologyProfileFormProps {
  options: EcologyOptions;
}

/** Собирает поля, документы и сохранение анкеты в прежней карточке направления. */
export function EcologyProfileForm({ options }: EcologyProfileFormProps) {
  const { fields, change, save } = useEcologyProfileForm();
  const { operation } = useEcologyProfile();
  const isBusy = operation !== "idle";

  return (
    <div className={styles.card}>
      <EcologyProfileFields
        value={fields}
        options={options}
        onChange={change}
        disabled={isBusy}
      />

      <EcologyDocuments />

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
