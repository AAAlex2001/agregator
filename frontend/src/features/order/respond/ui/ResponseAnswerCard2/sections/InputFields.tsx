import React from "react";
import { Input } from "@/shared/ui";
import styles from "./sections.module.scss";

interface InputFieldsProps {
  deadline: string;
  onDeadlineChange: (value: string) => void;
  costEstimate: string;
  onCostEstimateChange: (value: string) => void;
}

export default function InputFields({
  deadline,
  onDeadlineChange,
  costEstimate,
  onCostEstimateChange,
}: InputFieldsProps) {
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^0-9]/g, "");
    onCostEstimateChange(filtered);
  };

  return (
    <div className={styles.inputSection}>
      <div className={styles.inputTitles}>
        <div className={styles.inputTitle}>Укажите ваши сроки</div>
        <div className={styles.inputTitle}>Ваша оценка стоимости работ</div>
      </div>
      <div className={styles.inputRow}>
        <Input
          type="date"
          variant="text"
          active
          className={styles.inputField}
          value={deadline}
          onChange={(e) => onDeadlineChange(e.target.value)}
        />
        <Input
          type="text"
          variant="text"
          active
          className={styles.inputField}
          value={costEstimate}
          onChange={handleCostChange}
          placeholder="Сумма в рублях"
          inputMode="numeric"
        />
      </div>
      <div className={styles.inputHint}>
        Указанная вами сумма является ориентировочной. Точная стоимость будет согласована с заказчиком после изучения технического задания.
      </div>
    </div>
  );
}
