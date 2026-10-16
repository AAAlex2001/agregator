"use client";

import { useId } from "react";
import { CardInput } from "@/shared/ui/card-input";
import { Checkbox } from "@/shared/ui/checkbox";
import styles from "./style.module.scss";

/** Включено ли описание иной профессии и его текст. */
interface OtherProfessionFieldProps {
  enabled: boolean;
  text: string;
  onToggle: (enabled: boolean) => void;
  onTextChange: (text: string) => void;
}

/** Позволяет описать специалиста своими словами вместо удостоверений. */
export function OtherProfessionField({
  enabled,
  text,
  onToggle,
  onTextChange,
}: OtherProfessionFieldProps) {
  const id = useId();

  return (
    <div className={styles.wrap}>
      <Checkbox
        id={id}
        checked={enabled}
        onChange={onToggle}
        className={styles.choice}
      >
        <span className={styles.text}>
          <span className={styles.label}>Иная профессия</span>
          <span className={styles.description}>
            Ищу не исполнителя, а другого специалиста — опишу требования сам
          </span>
        </span>
      </Checkbox>

      {enabled && (
        <CardInput
          className={styles.details}
          multiline
          rows={4}
          value={text}
          onChange={onTextChange}
          placeholder="Опишите, кого вы ищете: профессия, обязанности, требования, опыт…"
        />
      )}
    </div>
  );
}
