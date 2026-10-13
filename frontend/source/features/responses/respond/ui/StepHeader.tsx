import s from "./StepHeader.module.scss";

interface StepHeaderProps {
  step: string;
}

export function StepHeader({ step }: StepHeaderProps) {
  return (
    <div className={s.header}>
      <span className={s.title}>Отклик на заказ</span>
      <span className={s.step}>{step}</span>
    </div>
  );
}
