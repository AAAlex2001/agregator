import type { ReactNode } from "react";
import s from "./style.module.scss";

interface Props {
  title?: ReactNode;
  right?: ReactNode;
  bare?: boolean;
  heading?: string;
  panel?: boolean;
  hero?: ReactNode;
  children: ReactNode;
}

export function Screen({ title, right, bare = false, heading, panel = false, hero, children }: Props) {
  return (
    <div className={s.screen}>
      {!bare && (
        <header className={s.topbar}>
          <div className={s.title}>{title}</div>
          {right && <div className={s.right}>{right}</div>}
        </header>
      )}
      {panel ? (
        <main className={s.bleed}>
          {hero ? (
            <div className={s.heroSlot}>{hero}</div>
          ) : (
            heading && (
              <div className={s.head}>
                <h1 className={s.heading}>{heading}</h1>
              </div>
            )
          )}
          <div className={s.panel}>{children}</div>
        </main>
      ) : (
        <main className={s.content}>
          {heading && <h1 className={s.heading}>{heading}</h1>}
          {children}
        </main>
      )}
    </div>
  );
}
