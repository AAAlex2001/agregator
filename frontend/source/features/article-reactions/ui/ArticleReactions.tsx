"use client";

import { useState } from "react";
import { useArticleReactions, type ReactionState, type ReactionValue } from "@/source/entities/article-reaction";
import { EyeIcon } from "@/source/shared/ui/icons";
import { ThumbDownIcon } from "@/source/shared/ui/icons/ThumbDownIcon";
import { ThumbUpIcon } from "@/source/shared/ui/icons/ThumbUpIcon";
import s from "./ArticleReactions.module.scss";

interface Props {
  articleId: number;
  initial?: ReactionState;
  views?: number;
}

export function ArticleReactions({ articleId, initial, views }: Props) {
  const { state, react, pending } = useArticleReactions(articleId, initial);
  const [hint, setHint] = useState("");

  const onVote = (value: ReactionValue) => {
    setHint("");
    void react(value);
  };

  return (
    <section className={s.reactions} aria-label="Оценка статьи">
      <span className={s.caption}>Была полезна статья?</span>

      <div className={s.buttons}>
        <button
          type="button"
          className={`${s.btn} ${state.my_reaction === "LIKE" ? s.likeActive : ""}`}
          onClick={() => onVote("LIKE")}
          disabled={pending}
          aria-pressed={state.my_reaction === "LIKE"}
          aria-label="Полезна"
        >
          <ThumbUpIcon filled={state.my_reaction === "LIKE"} className={s.icon} />
          <span className={s.count}>{state.likes_count}</span>
        </button>

        <button
          type="button"
          className={`${s.btn} ${state.my_reaction === "DISLIKE" ? s.dislikeActive : ""}`}
          onClick={() => onVote("DISLIKE")}
          disabled={pending}
          aria-pressed={state.my_reaction === "DISLIKE"}
          aria-label="Бесполезна"
        >
          <ThumbDownIcon filled={state.my_reaction === "DISLIKE"} className={s.icon} />
          <span className={s.count}>{state.dislikes_count}</span>
        </button>
      </div>

      {hint && <span className={s.hint}>{hint}</span>}

      {views !== undefined && (
        <span className={s.views} title="Просмотры">
          <EyeIcon className={s.viewsIcon} />
          {views}
        </span>
      )}
    </section>
  );
}
