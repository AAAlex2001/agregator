import { articleImage } from "../../model/preview";
import type { ArticleListItem } from "../../model/types";
import s from "./style.module.scss";

interface Props {
  article: ArticleListItem;
  onClick: () => void;
}

export function ArticleSlide({ article, onClick }: Props) {
  const image = articleImage(article);

  return (
    <button type="button" className={s.slide} onClick={onClick}>
      {image && <img className={s.image} src={image} alt="" loading="lazy" decoding="async" />}
      <span className={s.content}>
        <span className={s.title}>{article.title}</span>
      </span>
    </button>
  );
}
