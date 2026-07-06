import { blogPreviewSrc } from "../../model/preview";
import type { ArticleListItem } from "../../model/types";
import s from "./style.module.scss";

interface Props {
  article: ArticleListItem;
  onClick: () => void;
}

const KIND_LABEL: Record<string, string> = { news: "Новости", blog: "Блог" };

export function ArticleSlide({ article, onClick }: Props) {
  const fallbackToCover = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (article.cover_image && e.currentTarget.src !== article.cover_image) {
      e.currentTarget.src = article.cover_image;
    }
  };

  return (
    <button type="button" className={s.slide} onClick={onClick}>
      <span className={s.media}>
        <img
          className={s.image}
          src={blogPreviewSrc(article.slug)}
          alt=""
          loading="lazy"
          decoding="async"
          onError={fallbackToCover}
        />
        <span className={s.kind}>{KIND_LABEL[article.kind] ?? "Блог"}</span>
      </span>
      <span className={s.title}>{article.title}</span>
    </button>
  );
}
