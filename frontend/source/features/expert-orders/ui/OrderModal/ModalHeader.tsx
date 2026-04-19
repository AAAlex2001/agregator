import s from "./ModalHeader.module.scss";

interface Props {
  title: string;
  step: string;
}

export function ModalHeader({ title, step }: Props) {
  return (
    <div className={s.header}>
      <span className={s.title}>{title}</span>
      <span className={s.step}>{step}</span>
    </div>
  );
}