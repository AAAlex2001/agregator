import cn from "classnames";
import s from "./ArticleContent.module.scss";

interface ArticleContentProps {
  html: string;
  wideImage?: boolean;
}

/** Текст статьи из редактора с типографикой блога; wideImage — для картинки-финала на всю ширину. */
export function ArticleContent({ html, wideImage = false }: ArticleContentProps) {
  return <div className={cn(s.content, { [s.wideImage]: wideImage })} dangerouslySetInnerHTML={{ __html: html }} />;
}
