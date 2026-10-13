import cn from "classnames";
import type { RtnComment, RtnCommentReaction } from "@/source/entities/rtn";
import s from "./CommentReactions.module.scss";

const REACTIONS: { value: RtnCommentReaction; label: string; count: (comment: RtnComment) => number }[] = [
  { value: "USEFUL", label: "Полезно", count: (comment) => comment.useful_count },
  { value: "CLARIFICATION", label: "Есть уточнение", count: (comment) => comment.clarification_count },
  { value: "AGREE", label: "Согласен с практикой", count: (comment) => comment.agree_count },
];

interface CommentReactionsProps {
  comment: RtnComment;
  onReact: (value: RtnCommentReaction) => void;
}

/** «Полезно», «Есть уточнение», «Согласен с практикой» — со счётчиками; своя отметка подсвечена. */
export function CommentReactions({ comment, onReact }: CommentReactionsProps) {
  return (
    <div className={s.row}>
      {REACTIONS.map((reaction) => (
        <button
          key={reaction.value}
          type="button"
          className={cn(s.button, { [s.active]: comment.my_reaction === reaction.value })}
          onClick={() => onReact(reaction.value)}
        >
          {reaction.label}
          <span className={s.count}>{reaction.count(comment)}</span>
        </button>
      ))}
    </div>
  );
}
