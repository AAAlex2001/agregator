import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

interface DoneStepProps {
  onBackToLogin: () => void;
}

/** Предлагает войти после успешной смены пароля. */
export function DoneStep({ onBackToLogin }: DoneStepProps) {
  return (
    <div className={styles.done}>
      <span
        className={styles.check}
        aria-hidden="true"
      >
        ✓
      </span>
      <h2 className={styles.title}>Пароль обновлён</h2>
      <p className={styles.text}>Теперь войдите с новым паролем</p>
      <Button
        variant="primary"
        fullWidth
        onClick={onBackToLogin}
      >
        Войти
      </Button>
    </div>
  );
}
