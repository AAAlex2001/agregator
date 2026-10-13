import Button from "@/source/shared/ui/Button";
import s from "./DoneStep.module.scss";

interface DoneStepProps {
  onBackToLogin: () => void;
}

/** Пароль обновлён: предлагаем войти с новым. */
export function DoneStep({ onBackToLogin }: DoneStepProps) {
  return (
    <div className={s.done}>
      <span className={s.check} aria-hidden="true">
        ✓
      </span>
      <h2 className={s.title}>Пароль обновлён</h2>
      <p className={s.text}>Теперь войдите с новым паролем</p>
      <Button variant="primary" fullWidth onClick={onBackToLogin}>
        Войти
      </Button>
    </div>
  );
}
