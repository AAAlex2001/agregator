import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Где форма, что написать на отправке и куда уйти с первого шага. */
interface StepActionsProps {
  isFirst: boolean;
  isLast: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  cancelHref?: string;
  onCancel?: () => void;
  onBack: () => void;
}

/** Кнопки шага: «Отмена» или «Назад» слева, «Далее» или отправка справа. Отправляет форма. */
export function StepActions({
  isFirst,
  isLast,
  isSubmitting,
  submitLabel,
  cancelHref,
  onCancel,
  onBack,
}: StepActionsProps) {
  return (
    <div className={styles.actions}>
      {isFirst ? (
        <Button
          variant="outline"
          size="field"
          href={cancelHref}
          onClick={onCancel}
        >
          Отмена
        </Button>
      ) : (
        <Button
          variant="outline"
          size="field"
          onClick={onBack}
        >
          Назад
        </Button>
      )}
      <Button
        type="submit"
        size="field"
        isLoading={isSubmitting}
      >
        {isLast ? submitLabel : "Далее"}
      </Button>
    </div>
  );
}