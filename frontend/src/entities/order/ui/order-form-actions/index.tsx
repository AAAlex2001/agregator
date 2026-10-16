import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Действия формы заказа и состояние отправки данных. */
interface OrderFormActionsProps {
  submitText: string;
  isSaving: boolean;
  onCancel: () => void;
  onCopy: () => void;
}

/** Показывает копирование, отмену и подтверждение формы заказа. */
export function OrderFormActions({
  submitText,
  isSaving,
  onCancel,
  onCopy,
}: OrderFormActionsProps) {
  return (
    <div className={styles.row}>
      <Button
        type="button"
        variant="outlineOrange"
        size="md"
        fullWidth
        onClick={onCopy}
      >
        Скопировать
      </Button>
      <Button
        type="button"
        variant="transparent"
        size="md"
        fullWidth
        className={styles.cancel}
        onClick={onCancel}
      >
        Отмена
      </Button>
      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        className={styles.submit}
        isLoading={isSaving}
      >
        {submitText}
      </Button>
    </div>
  );
}
