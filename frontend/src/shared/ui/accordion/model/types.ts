import type { ReactNode } from "react";

/** Заголовок и содержимое одного раскрывающегося пункта. */
export interface AccordionItem {
  id: string;
  question: string;
  answer: ReactNode;
}
