import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Доступность регистрации и действия для гостя или вошедшего пользователя. */
interface InvitationActionsProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  onOpenRegistration: () => void;
  onOpenLogin: () => void;
}

/** Показывает вход и регистрацию гостю или ссылку в кабинет действующему пользователю. */
export function InvitationActions({
  isAuthenticated,
  isLoading,
  error,
  onOpenRegistration,
  onOpenLogin,
}: InvitationActionsProps) {
  if (isAuthenticated) {
    return (
      <>
        <p className={styles.message}>
          Вы уже вошли в аккаунт. Приглашения действуют для новых исполнителей.
        </p>
        <Button
          href="/settings"
          variant="chat"
        >
          Перейти в кабинет
        </Button>
      </>
    );
  }

  return (
    <div className={styles.actions}>
      <Button
        variant="chat"
        onClick={onOpenRegistration}
        disabled={isLoading || Boolean(error)}
      >
        Зарегистрироваться
      </Button>
      <button
        type="button"
        className={styles.login}
        onClick={onOpenLogin}
      >
        Уже есть аккаунт? Войти
      </button>
    </div>
  );
}
