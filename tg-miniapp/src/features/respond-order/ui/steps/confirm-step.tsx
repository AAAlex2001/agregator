import s from "./confirm-step.module.scss";
import c from "./common.module.scss";

export function ConfirmStep() {
  return (
    <div className={c.step}>
      <p className={s.lead}>Проверьте условия — на следующем шаге заполните предложение.</p>
      <div className={s.group}>
        <span className={c.blockLab}>Что будет дальше</span>
        <div className={s.card}>
          <ul className={s.checklist}>
            <li><span className={s.ck}>1</span><span>Отклик спишется с вашего тарифа сразу после отправки.</span></li>
            <li><span className={s.ck}>2</span><span>Заказчик увидит ваше предложение и сможет связаться с вами в чате.</span></li>
            <li><span className={s.ck}>3</span><span>Если заказчик выберет вас — детали согласуете напрямую.</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
