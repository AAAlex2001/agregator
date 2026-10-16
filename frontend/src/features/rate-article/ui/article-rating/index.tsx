"use client";

import cn from "classnames";
import { EyeIcon, ThumbDownIcon, ThumbUpIcon } from "@/shared/ui/icons";
import type { RateArticleProps } from "../../model/types";
import { useRateArticle } from "../../model/use-rate-article";
import styles from "./style.module.scss";

/** Показывает оценку посетителя, кнопки голосования и счётчик просмотров. */
export function ArticleRating({ articleId, initial }: RateArticleProps) {
  const {
    reactions,
    isSending,
    like,
    dislike,
  } = useRateArticle({ articleId, initial });
  const isLiked = reactions.my_reaction === "LIKE";
  const isDisliked = reactions.my_reaction === "DISLIKE";

  return (
    <section
      className={styles.reactions}
      aria-label="Оценка статьи"
    >
      <span className={styles.caption}>
        Была полезна статья?
      </span>
      <div className={styles.buttons}>
        <button
          type="button"
          className={cn(styles.btn, { [styles.likeActive]: isLiked })}
          onClick={like}
          disabled={isSending}
          aria-pressed={isLiked}
          aria-label="Полезна"
        >
          <ThumbUpIcon
            filled={isLiked}
            className={styles.icon}
          />
          <span className={styles.count}>
            {reactions.likes_count}
          </span>
        </button>
        <button
          type="button"
          className={cn(styles.btn, { [styles.dislikeActive]: isDisliked })}
          onClick={dislike}
          disabled={isSending}
          aria-pressed={isDisliked}
          aria-label="Бесполезна"
        >
          <ThumbDownIcon
            filled={isDisliked}
            className={styles.icon}
          />
          <span className={styles.count}>
            {reactions.dislikes_count}
          </span>
        </button>
      </div>
      <span
        className={styles.views}
        title="Просмотры"
      >
        <EyeIcon className={styles.viewsIcon} />
        {reactions.views_count}
      </span>
    </section>
  );
}
