"use client";

import {
  useRtnReactions,
  type RtnReactionState,
  type RtnReactionValue,
} from "@/source/entities/rtn-clarification";
import { EyeIcon } from "@/source/shared/ui/icons";
import { ThumbDownIcon } from "@/source/shared/ui/icons/ThumbDownIcon";
import { ThumbUpIcon } from "@/source/shared/ui/icons/ThumbUpIcon";
import s from "./RtnClarificationReactions.module.scss";

interface Props {
  clarificationId: number;
  initial: RtnReactionState;
}

export function RtnClarificationReactions({ clarificationId, initial }: Props) {
  const { state, react, pending } = useRtnReactions(clarificationId, initial);

  const onVote = (value: RtnReactionValue) => {
    void react(value);
  };

  return (
    <section className={s.reactions} aria-label="Оценка разъяснения">
      <span className={s.caption}>Была полезна статья?</span>
      <div className={s.buttons}>
        <button
          type="button"
          className={`${s.button} ${state.my_reaction === "LIKE" ? s.likeActive : ""}`}
          onClick={() => onVote("LIKE")}
          disabled={pending}
          aria-pressed={state.my_reaction === "LIKE"}
          aria-label="Полезно"
        >
          <ThumbUpIcon filled={state.my_reaction === "LIKE"} />
          <span>{state.likes_count}</span>
        </button>
        <button
          type="button"
          className={`${s.button} ${state.my_reaction === "DISLIKE" ? s.dislikeActive : ""}`}
          onClick={() => onVote("DISLIKE")}
          disabled={pending}
          aria-pressed={state.my_reaction === "DISLIKE"}
          aria-label="Не полезно"
        >
          <ThumbDownIcon filled={state.my_reaction === "DISLIKE"} />
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
