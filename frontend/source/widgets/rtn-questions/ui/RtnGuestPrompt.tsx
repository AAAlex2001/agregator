import Button from "@/source/shared/ui/Button";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./RtnQuestionsWidget.module.scss";

export function RtnGuestPrompt() {
  return (
    <div className={s.guestBlock}>
      <div className={s.guestCopy}>
        <Title text="Задать вопрос" as="h2" className={s.guestTitle} />
        <Subtitle
          text="Войдите в аккаунт или зарегистрируйтесь, чтобы отправить вопрос, видеть статус его рассмотрения и не пропустить опубликованный ответ."
          className={s.guestDescription}
        />
      </div>
      <div className={s.guestActions}>
        <Button href="/register" variant="primary">Зарегистрироваться</Button>
        <Button href="/login" variant="outlineOrange">Войти</Button>
      </div>
    </div>
  );
}
