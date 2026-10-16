import styles from "./style.module.scss";

/** Подпись для доступности и действие удаления строки списка. */
interface RemoveButtonProps {
  label: string;
  onClick: () => void;
}

/** Показывает квадратную кнопку «×» рядом со строкой списка. */
export function RemoveButton({ label, onClick }: RemoveButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      aria-label={label}
      onClick={onClick}
    >
      ×
    </button>
  );
}
