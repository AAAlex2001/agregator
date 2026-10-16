"use client";

import { DesignProfileFields, useDesignProfile } from "@/entities/design";
import type { DesignOptions } from "@/entities/design";
import { Button } from "@/shared/ui/button";
import { useDesignProfileForm } from "../../model/use-design-profile-form";
import { DesignDocuments } from "../design-documents";
import styles from "./style.module.scss";

/** Справочники специальностей проектировщика и областей аттестации РТН. */
interface DesignProfileFormProps {
  options: DesignOptions;
}

/** Собирает сведения, пять групп документов и сохранение анкеты проектировщика. */
export function DesignProfileForm({ options }: DesignProfileFormProps) {
  const { fields, change, save } = useDesignProfileForm();
  const { operation } = useDesignProfile();
  const isBusy = operation !== "idle";

  return (
    <div className={styles.card}>
      <fieldset
        className={styles.fields}
        disabled={isBusy}
      >
        <DesignProfileFields
          value={fields}
          options={options}
          onChange={change}
        />
        <DesignDocuments />
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
