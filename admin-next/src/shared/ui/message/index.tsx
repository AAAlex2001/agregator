import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type MessageProps = {
  children: ReactNode;
  tone?: "muted" | "error";
};

/** Короткое сообщение вместо данных: «пока пусто» или «не удалось загрузить». */
const Message = ({ children, tone = "muted" }: MessageProps) => (
  <p className={cn(styles.message, styles[tone])}>{children}</p>
);

export default Message;
