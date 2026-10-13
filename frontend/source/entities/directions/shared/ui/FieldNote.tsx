import type { ReactNode } from "react";
import s from "./FieldNote.module.scss";

interface FieldNoteProps {
  children: ReactNode;
}

/** Серая приписка под полями, например про файлы, которые прикладываются ниже. */
export function FieldNote({ children }: FieldNoteProps) {
  return <span className={s.note}>{children}</span>;
}
