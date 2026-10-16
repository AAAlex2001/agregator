import cn from "classnames";
import styles from "./style.module.scss";

/** Текст, уровень и оформление заголовка страницы или раздела. */
interface TitleProps {
  id?: string;
  text?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

/** Показывает заголовок с выбранным уровнем и общей типографикой сайта. */
export function Title({ id, text, className, as: Tag = "h2" }: TitleProps) {
  return (
    <Tag
      id={id}
      className={cn(styles.title, className)}
    >
      {text}
    </Tag>
  );
}
