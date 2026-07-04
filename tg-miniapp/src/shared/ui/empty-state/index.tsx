import type { ReactNode } from "react";
import s from "./style.module.scss";

interface Props {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <div className={s.wrap}>
      {icon}
      <p className={s.title}>{title}</p>
      <p className={s.subtitle}>{subtitle}</p>
    </div>
  );
}
