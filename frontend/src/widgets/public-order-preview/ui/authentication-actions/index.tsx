import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Действия страницы, открывающие общую авторизацию приложения. */
interface AuthenticationActionsProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

/** Предлагает войти или зарегистрироваться перед откликом на заказ. */
export function AuthenticationActions({
  onOpenLogin,
  onOpenRegister,
}: AuthenticationActionsProps) {
  return (
    <>
      <div className={styles.divider} />
      <p className={styles.ctaText}>
        Войдите или зарегистрируйтесь как исполнитель, чтобы откликнуться на заказ
      </p>
      <div className={styles.actions}>
        <div className={styles.actionLink}>
          <Button
            variant="chat"
            size="lg"
            fullWidth
            onClick={onOpenLogin}
          >
            Войти
          </Button>
        </div>
        <div className={styles.actionLink}>
          <Button
            variant="outlineOrange"
            size="lg"
            fullWidth
            onClick={onOpenRegister}
          >
            Зарегистрироваться
          </Button>
        </div>
      </div>
    </>
  );
}
