import Button from "@/source/shared/ui/Button";
import { LogoutIcon } from "@/source/shared/ui/icons";
import s from "./ProfileForm.module.scss";

interface Props {
  isSaving: boolean;
  isLoggingOut: boolean;
  onLogout: () => void;
}

export function SaveBar({ isSaving, isLoggingOut, onLogout }: Props) {
  return (
    <div className={s.saveWrapper}>
      <Button type="submit" variant="chat" size="md" className={s.saveButton} isLoading={isSaving}>
        Сохранить изменения
      </Button>
      <Button
        type="button"
        variant="chat"
        size="md"
        className={s.logoutButton}
        onClick={onLogout}
        isLoading={isLoggingOut}
      >
        <span className={s.logoutContent}>
          <LogoutIcon className={s.logoutIcon} />
          Выйти
        </span>
      </Button>
    </div>
  );
}
