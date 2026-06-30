import type { ReactNode } from "react";
import s from "./style.module.scss";

interface Props {
  title: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}

export function Screen({ title, right, children }: Props) {
  return (
    <div className={s.screen}>
      <header className={s.topbar}>
        <div className={s.title}>{title}</div>
        {right && <div className={s.right}>{right}</div>}
      </header>
      <main className={s.content}>{children}</main>
    </div>
  );
}
