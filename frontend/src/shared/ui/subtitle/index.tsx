import cn from "classnames";
import styles from "./style.module.scss";

/** Текст и дополнительное оформление пояснения к заголовку. */
interface SubtitleProps {
  text?: string;
  className?: string;
}

/** Показывает подзаголовок с общей типографикой сайта. */
export function Subtitle({ text, className }: SubtitleProps) {
  return <p className={cn(styles.subtitle, className)}>{text}</p>;
}
