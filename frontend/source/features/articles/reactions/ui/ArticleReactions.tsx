"use client";

import cn from "classnames";
import type { ReactionState } from "@/source/entities/article";
import { EyeIcon } from "@/source/shared/ui/icons";
import { ThumbDownIcon } from "@/source/shared/ui/icons/ThumbDownIcon";
import { ThumbUpIcon } from "@/source/shared/ui/icons/ThumbUpIcon";
import { useArticleReactions } from "../model/useArticleReactions";
import s from "./ArticleReactions.module.scss";

interface ArticleReactionsProps {
  articleId: number;
  initial: ReactionState | undefined;
}

/** «Была полезна статья?» — лайк, дизлайк и счётчик просмотров. */
export function ArticleReactions({ articleId, initial }: ArticleReactionsProps) {
  const { state, isSending, react } = useArticleReactions(articleId, initial);
  const isLiked = state.my_reaction === "LIKE";
  const isDisliked = state.my_reaction === "DISLIKE";

  return (
    <section className={s.reactions} aria-label="Оценка статьи">
      <span className={s.caption}>Была полезна статья?</span>

      <div className={s.buttons}>
        <button
          type="button"
          className={cn(s.btn, { [s.likeActive]: isLiked })}
          onClick={() => react("LIKE")}
          disabled={isSending}
          aria-pressed={isLiked}
          aria-label="Полезна"
        >
          <ThumbUpIcon filled={isLiked} className={s.icon} />
          <span className={s.count}>{state.likes_count}</span>
        </button>

        <button
          type="button"
          className={cn(s.btn, { [s.dislikeActive]: isDisliked })}
          onClick={() => react("DISLIKE")}
          disabled={isSending}
          aria-pressed={isDisliked}
          aria-label="Бесполезна"
        >
          <ThumbDownIcon filled={isDisliked} className={s.icon} />
          <span className={s.count}>{state.dislikes_count}</span>
        </button>
      </div>

      <span className={s.views} title="Просмотры">
        <EyeIcon className={s.viewsIcon} />
        {state.views_count}
      </span>
    </section>
  );
}
