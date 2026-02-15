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
  return (
    <div className={styles.inputSection}>
      <div className={styles.inputTitles}>
        <div className={styles.inputTitle}>Укажите ваши сроки</div>
        <div className={styles.inputTitle}>Ваша оценка стоимости работ</div>
      </div>
      <div className={styles.inputRow}>
        <input
          type="date"
          className={styles.inputField}
          value={deadline}
          onChange={(e) => onDeadlineChange(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputField}
          value={costEstimate}
          onChange={(e) => onCostEstimateChange(e.target.value)}
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
