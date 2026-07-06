import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import { useReactions } from "../model/use-reactions";
import s from "./article-reactions.module.scss";

interface Props {
  articleId: number;
}

function ThumbIcon({ down }: { down?: boolean }) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={down ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M7 10v11" />
      <path d="M7 10 11 3a2 2 0 0 1 2.6 1.2l.4 1.3a2 2 0 0 0 0 .5l-1 3.5h5.5a2 2 0 0 1 2 2.5l-1.6 6A2 2 0 0 1 18 22H7" />
    </svg>
  );
}

export function ArticleReactions({ articleId }: Props) {
  const { data, busy, react } = useReactions(articleId);

  if (!data) return null;

  return (
    <div className={s.wrap}>
      <span className={s.hint}>Была ли статья полезной?</span>
      <div className={s.buttons}>
        <button
          className={cn(s.btn, { [s.likeActive]: data.my_reaction === "LIKE" })}
          disabled={busy}
          onClick={() => {
            tapHaptic();
            void react("LIKE");
          }}
        >
          <ThumbIcon />
          {data.likes_count}
        </button>
        <button
          className={cn(s.btn, { [s.dislikeActive]: data.my_reaction === "DISLIKE" })}
          disabled={busy}
          onClick={() => {
            tapHaptic();
            void react("DISLIKE");
          }}
        >
          <ThumbIcon down />
          {data.dislikes_count}
        </button>
      </div>
    </div>
  );
}
