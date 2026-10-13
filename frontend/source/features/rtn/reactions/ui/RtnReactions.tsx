"use client";

import cn from "classnames";
import type { RtnDetail } from "@/source/entities/rtn";
import { EyeIcon } from "@/source/shared/ui/icons";
import { ThumbDownIcon } from "@/source/shared/ui/icons/ThumbDownIcon";
import { ThumbUpIcon } from "@/source/shared/ui/icons/ThumbUpIcon";
import { useRtnReactions } from "../model/useRtnReactions";
import s from "./RtnReactions.module.scss";

interface RtnReactionsProps {
  clarification: RtnDetail;
}

/** «Была полезна статья?» — лайк, дизлайк и счётчик просмотров. */
export function RtnReactions({ clarification }: RtnReactionsProps) {
  const { state, isSending, react } = useRtnReactions(clarification.id, {
    likes_count: clarification.likes_count,
    dislikes_count: clarification.dislikes_count,
    views_count: clarification.views_count,
    my_reaction: null,
  });
  const isLiked = state.my_reaction === "LIKE";
  const isDisliked = state.my_reaction === "DISLIKE";

  return (
    <section className={s.reactions} aria-label="Оценка разъяснения">
      <span className={s.caption}>Была полезна статья?</span>
      <div className={s.buttons}>
        <button
          type="button"
          className={cn(s.button, { [s.likeActive]: isLiked })}
          onClick={() => react("LIKE")}
          disabled={isSending}
          aria-pressed={isLiked}
          aria-label="Полезно"
        >
          <ThumbUpIcon filled={isLiked} />
          <span>{state.likes_count}</span>
        </button>
        <button
          type="button"
          className={cn(s.button, { [s.dislikeActive]: isDisliked })}
          onClick={() => react("DISLIKE")}
          disabled={isSending}
          aria-pressed={isDisliked}
          aria-label="Не полезно"
        >
          <ThumbDownIcon filled={isDisliked} />
          <span>{state.dislikes_count}</span>
        </button>
      </div>
      <span className={s.views} title="Просмотры">
        <EyeIcon className={s.viewsIcon} />
        {state.views_count}
      </span>
    </section>
  );
}
