import type { ReactNode } from "react";
import s from "./DirectionList.module.scss";

interface DirectionListProps {
  children: ReactNode;
}

/** Список направлений для выбора при регистрации. */
export function DirectionList({ children }: DirectionListProps) {
  return <ul className={s.list}>{children}</ul>;
}
