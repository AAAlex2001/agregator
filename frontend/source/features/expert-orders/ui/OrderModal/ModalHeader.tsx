import s from "./orderFlow.module.scss";

interface Props {
  title: string;
  step: string;
}

export function ModalHeader({ title, step }: Props) {
  return (
    <div className={s.header}>
      <span className={s.headerTitle}>{title}</span>
      <span className={s.headerStep}>{step}</span>
    </div>
  );
}