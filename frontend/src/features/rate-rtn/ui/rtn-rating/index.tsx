"use client";

import classNames from "classnames";
import { EyeIcon, ThumbDownIcon, ThumbUpIcon } from "@/shared/ui/icons";
import type { RateRtnProps } from "../../model/types";
import { useRateRtn } from "../../model/use-rate-rtn";
import styles from "./style.module.scss";

/** Показывает оценку полезности разъяснения и число его просмотров. */
export function RtnRating({ clarificationId, initial }: RateRtnProps) {
  const { reactions, isSending, like, dislike } = useRateRtn({
    clarificationId,
    initial,
  });
  const isLiked = reactions.my_reaction === "LIKE";
  const isDisliked = reactions.my_reaction === "DISLIKE";

  return (
    <section
      className={styles.reactions}
      aria-label="Оценка разъяснения"
    >
      <span className={styles.caption}>Была полезна статья?</span>
      <div className={styles.buttons}>
        <button
          type="button"
          className={classNames(styles.button, {
            [styles.likeActive]: isLiked,
          })}
          onClick={like}
          disabled={isSending}
          aria-pressed={isLiked}
          aria-label="Полезно"
        >
          <ThumbUpIcon filled={isLiked} />
          <span>{reactions.likes_count}</span>
        </button>
        <button
          type="button"
          className={classNames(styles.button, {
            [styles.dislikeActive]: isDisliked,
          })}
          onClick={dislike}
          disabled={isSending}
          aria-pressed={isDisliked}
          aria-label="Не полезно"
        >
          <ThumbDownIcon filled={isDisliked} />
          <span>{reactions.dislikes_count}</span>
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
