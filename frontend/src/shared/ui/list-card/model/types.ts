import type { ReactNode } from "react";

/** Подпись и значение в правой колонке карточки списка. */
export interface ListCardItem {
  label: ReactNode;
  value: ReactNode;
  valueAccent?: boolean;
  valueOrange?: boolean;
}

/** Содержимое карточки: заголовок, сведения, действия и дополнительные секции. */
export interface ListCardProps {
  meta?: ReactNode;
  statusText?: string;
  statusClassName?: string;
  statusColor?: string;
  statusBg?: string;
  titleLabel?: string;
  title: ReactNode;
  bottomLeftLabel?: string;
  bottomLeftValue?: ReactNode;
  bottomLeftCustom?: ReactNode;
  rightItems?: ListCardItem[];
  onClick?: () => void;
  actions?: ReactNode;
  leftExtra?: ReactNode;
  headerExtra?: ReactNode;
  details?: ReactNode;
  footer?: ReactNode;
}
