"use client";

import type { ChangeEvent } from "react";
import { RemoveButton } from "@/shared/ui/remove-button";
import { TextInput } from "@/shared/ui/text-input";
import styles from "./style.module.scss";

/** Одна строка требований к исполнителю НИР и действия над ней. */
interface ResearchRequirementFieldProps {
  index: number;
  value: string;
  placeholder: string;
  canRemove: boolean;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

/** Показывает текст требования и удаление дополнительной строки. */
export function ResearchRequirementField({
  index,
  value,
  placeholder,
  canRemove,
  onChange,
  onRemove,
}: ResearchRequirementFieldProps) {
  /** Передаёт новый текст требования вместе с его позицией. */
  function changeRequirement(event: ChangeEvent<HTMLInputElement>) {
    onChange(index, event.target.value);
  }

  /** Убирает выбранную строку требований. */
  function removeRequirement() {
    onRemove(index);
  }

  return (
    <div className={styles.row}>
      <TextInput
        value={value}
        className={styles.input}
        placeholder={placeholder}
        onChange={changeRequirement}
      />
      {canRemove && (
        <RemoveButton
          label="Убрать требование"
          onClick={removeRequirement}
        />
      )}
    </div>
  );
}
