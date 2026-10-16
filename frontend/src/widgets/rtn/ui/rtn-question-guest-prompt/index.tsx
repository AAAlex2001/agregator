import { Button } from "@/shared/ui/button";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Действия приложения для входа и регистрации посетителя. */
interface RtnQuestionGuestPromptProps {
  onLogin: () => void;
  onRegister: () => void;
}

/** Предлагает гостю войти, чтобы отправить обращение и следить за ответом. */
export function RtnQuestionGuestPrompt({
  onLogin,
  onRegister,
}: RtnQuestionGuestPromptProps) {
  return (
    <div className={styles.block}>
      <div className={styles.copy}>
        <Title
          text="Задать вопрос"
          as="h2"
          className={styles.title}
        />
        <Subtitle
          text="Войдите в аккаунт или зарегистрируйтесь, чтобы отправить вопрос, видеть статус его рассмотрения и не пропустить опубликованный ответ."
          className={styles.description}
        />
      </div>
      <div className={styles.actions}>
        <Button
          variant="primary"
          onClick={onRegister}
        >
          Зарегистрироваться
        </Button>
        <Button
          variant="outlineOrange"
          onClick={onLogin}
        >
          Войти
        </Button>
      </div>
    </div>
  );
}
