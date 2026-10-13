import { AuthTrigger } from "@/source/shared/ui/AuthTrigger";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./RtnGuestPrompt.module.scss";

/** Вместо формы вопроса для гостя: войти или зарегистрироваться. */
export function RtnGuestPrompt() {
  return (
    <div className={s.block}>
      <div className={s.copy}>
        <Title text="Задать вопрос" as="h2" className={s.title} />
        <Subtitle
          text="Войдите в аккаунт или зарегистрируйтесь, чтобы отправить вопрос, видеть статус его рассмотрения и не пропустить опубликованный ответ."
          className={s.description}
        />
      </div>
      <div className={s.actions}>
        <AuthTrigger tab="register" variant="primary">
          Зарегистрироваться
        </AuthTrigger>
        <AuthTrigger tab="login" variant="outlineOrange">
          Войти
        </AuthTrigger>
      </div>
    </div>
  );
}
