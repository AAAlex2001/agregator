import s from "../respond-sheet.module.scss";

export function ConfirmStep() {
  return (
    <div className={s.step}>
      <p className={s.lead}>Проверьте условия — на следующем шаге заполните предложение.</p>
      <span className={s.blockLab}>Что будет дальше</span>
      <ul className={s.checklist}>
        <li><span className={s.ck}>1</span><span>Отклик спишется с вашего тарифа сразу после отправки.</span></li>
        <li><span className={s.ck}>2</span><span>Заказчик увидит ваше предложение и сможет связаться с вами в чате.</span></li>
        <li><span className={s.ck}>3</span><span>Если заказчик выберет вас — детали согласуете напрямую.</span></li>
      </ul>
    </div>
  );
}
