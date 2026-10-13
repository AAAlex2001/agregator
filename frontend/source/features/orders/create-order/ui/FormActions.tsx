import Button from "@/source/shared/ui/Button";
import s from "./FormActions.module.scss";

interface FormActionsProps {
  isEdit: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onCopy: () => void;
}

export function FormActions({ isEdit, isSaving, onCancel, onCopy }: FormActionsProps) {
  return (
    <div className={s.row}>
      <Button type="button" variant="outlineOrange" size="md" fullWidth onClick={onCopy}>
        Скопировать
      </Button>
      <Button type="button" variant="transparent" size="md" fullWidth className={s.cancel} onClick={onCancel}>
        Отмена
      </Button>
      <Button type="submit" variant="primary" size="md" fullWidth className={s.submit} isLoading={isSaving}>
        {isEdit ? "Сохранить" : "Создать заказ"}
      </Button>
    </div>
  );
}
