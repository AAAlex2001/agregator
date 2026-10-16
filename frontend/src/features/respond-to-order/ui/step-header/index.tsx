import styles from "./style.module.scss";

/** Название текущего шага отклика. */
interface StepHeaderProps {
  step: string;
}

/** Показывает название сценария и текущий этап заполнения. */
export function StepHeader({ step }: StepHeaderProps) {
  return (
    <div className={styles.header}>
      <span className={styles.title}>Отклик на заказ</span>
      <span className={styles.step}>{step}</span>
    </div>
  );
}
