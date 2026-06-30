import type { ReactNode } from "react";
import s from "./style.module.scss";

interface Props {
  title?: ReactNode;
  right?: ReactNode;
  bare?: boolean;
  heading?: string;
  children: ReactNode;
}

export function Screen({ title, right, bare = false, heading, children }: Props) {
  return (
    <div className={s.screen}>
      {!bare && (
        <header className={s.topbar}>
          <div className={s.title}>{title}</div>
          {right && <div className={s.right}>{right}</div>}
        </header>
      )}
      <main className={s.content}>
        {heading && <h1 className={s.heading}>{heading}</h1>}
        {children}
      </main>
    </div>
  );
}
