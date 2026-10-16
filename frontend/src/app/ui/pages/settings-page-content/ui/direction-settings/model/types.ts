import type { ReactNode } from "react";

/** Вкладка направления и редактор его анкеты. */
export interface DirectionTab {
  id: string;
  label: string;
  editor: ReactNode;
}
