import Button from "@/source/shared/ui/Button";
import s from "./ProfileForm.module.scss";

interface Props {
  isSaving: boolean;
}

export function SaveBar({ isSaving }: Props) {
  return (
    <div className={s.saveWrapper}>
      <Button type="submit" variant="chat" size="md" className={s.saveButton} isLoading={isSaving}>
        Сохранить изменения
      </Button>
    </div>
  );
}
