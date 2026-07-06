import { articleImage } from "../../model/preview";
import type { ArticleListItem } from "../../model/types";
import s from "./style.module.scss";

interface Props {
  article: ArticleListItem;
  onClick: () => void;
}

function ThumbMini({ down }: { down?: boolean }) {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={down ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M7 10v11" />
      <path d="M7 10 11 3a2 2 0 0 1 2.6 1.2l.4 1.3a2 2 0 0 0 0 .5l-1 3.5h5.5a2 2 0 0 1 2 2.5l-1.6 6A2 2 0 0 1 18 22H7" />
    </svg>
  );
}

export function ArticleSlide({ article, onClick }: Props) {
  const image = articleImage(article);

  return (
    <button type="button" className={s.slide} onClick={onClick}>
      {image && <img className={s.image} src={image} alt="" loading="lazy" decoding="async" />}
      <span className={s.content}>
        <span className={s.title}>{article.title}</span>
        <span className={s.stats}>
          <span className={s.stat}>
            <ThumbMini /> {article.likes_count}
          </span>
          <span className={s.stat}>
            <ThumbMini down /> {article.dislikes_count}
          </span>
        </span>
      </span>
    </button>
  );
}
