import type { ReactNode } from "react";
import s from "./FieldStack.module.scss";

interface FieldStackProps {
  children: ReactNode;
}

/** Поля анкеты или заявки столбиком. */
export function FieldStack({ children }: FieldStackProps) {
  return <div className={s.stack}>{children}</div>;
}
