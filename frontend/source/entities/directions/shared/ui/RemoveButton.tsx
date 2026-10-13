import s from "./RemoveButton.module.scss";

interface RemoveButtonProps {
  label: string;
  onClick: () => void;
}

/** Квадратная кнопка «×» рядом со строкой списка. */
export function RemoveButton({ label, onClick }: RemoveButtonProps) {
  return (
    <button type="button" className={s.button} aria-label={label} onClick={onClick}>
      ×
    </button>
  );
}
