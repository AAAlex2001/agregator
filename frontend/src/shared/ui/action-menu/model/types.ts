import type { ReactNode } from "react";

/** Пункт меню: ссылка или кнопка с иконкой и необязательным пояснением. */
export interface MenuAction {
  label: string;
  description?: string;
  icon: ReactNode;
  href?: string;
  danger?: boolean;
  onClick?: () => void;
}
