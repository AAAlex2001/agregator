import { Button } from "@/shared/ui";
import s from "./formActions.module.scss";

interface Props {
  isEdit: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function FormActions({ isEdit, isSubmitting, onCancel }: Props) {
  return (
    <div className={s.row}>
      <Button type="button" variant="transparent" size="md" fullWidth className={s.cancel} onClick={onCancel}>
        Отмена
      </Button>
      <Button type="submit" variant="primary" size="md" fullWidth className={s.submit} isLoading={isSubmitting}>
        {isEdit ? "Сохранить" : "Создать заказ"}
      </Button>
    </div>
  );
}