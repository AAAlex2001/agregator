import cn from "classnames";
import styles from "./style.module.scss";

/** Текст из редактора и оформление завершающего изображения на всю ширину. */
interface ArticleContentProps {
  html: string;
  wideImage?: boolean;
}

/** Показывает серверный HTML статьи с типографикой новостей и блога. */
export function ArticleContent({
  html,
  wideImage = false,
}: ArticleContentProps) {
  return (
    <div
      className={cn(styles.content, {
        [styles.wideImage]: wideImage,
      })}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
