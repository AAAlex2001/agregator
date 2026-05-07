import type { ReactNode } from "react";
import s from "./DraftSection.module.scss";

interface Props {
  title: string;
  children: ReactNode;
}

export function DraftSection({ title, children }: Props) {
  return (
    <section className={s.section}>
      <h2 className={s.title}>{title}</h2>
      <div className={s.list}>{children}</div>
    </section>
  );
}
