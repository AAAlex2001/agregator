import Button from "@/source/shared/ui/Button";
import s from "./RtnQuestionsWidget.module.scss";

export function RtnGuestPrompt() {
  return (
    <section className={s.guestBlock}>
      <div className={s.guestMark} aria-hidden="true">?</div>
      <div className={s.guestCopy}>
        <h2>Вопросы доступны после регистрации</h2>
        <p>
          Войдите в аккаунт или зарегистрируйтесь, чтобы отправить вопрос, видеть статус его
          рассмотрения и не пропустить опубликованный ответ.
        </p>
      </div>
      <div className={s.guestActions}>
        <Button href="/register" variant="primary">Зарегистрироваться</Button>
        <Button href="/login" variant="outlineOrange">Войти</Button>
      </div>
    </section>
  );
}
