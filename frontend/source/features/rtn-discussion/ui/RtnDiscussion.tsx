"use client";

import { useRtnComments, type RtnComment, type RtnCommentSortBy } from "@/source/entities/rtn-comment";
import Loader from "@/source/shared/ui/Loader";
import { SortPills, type SortPillSpec } from "@/source/shared/ui/SortPills";
import { RtnCommentForm } from "./RtnCommentForm";
import { RtnCommentItem } from "./RtnCommentItem";
import s from "./RtnDiscussion.module.scss";

const SORT_PILLS: SortPillSpec<RtnCommentSortBy>[] = [
  { key: "useful_count", label: "Полезность", descLabel: "Сначала полезные", ascLabel: "Сначала менее полезные" },
  { key: "created_at", label: "Дата", descLabel: "Сначала новые", ascLabel: "Сначала старые" },
  { key: "is_expert", label: "Эксперты", descLabel: "Сначала эксперты", ascLabel: "Сначала не эксперты" },
];

interface Props {
  clarificationId: number;
  initialComments?: RtnComment[];
}

export function RtnDiscussion({ clarificationId, initialComments }: Props) {
  const { comments, loading, sortBy, sortDir, setSort, add, remove, react } = useRtnComments(
    clarificationId,
    initialComments,
  );
  const roots = comments.filter((c) => c.parent_id === null);

  return (
    <section className={s.discussion} aria-label="Профессиональное обсуждение">
      <h2 className={s.title}>
        Профессиональное обсуждение
        {comments.length > 0 && <span className={s.total}>{comments.length}</span>}
      </h2>
      <p className={s.subtitle}>
        Поделитесь практикой применения этого разъяснения или уточните спорные моменты с коллегами.
      </p>

      <RtnCommentForm placeholder="Ваш комментарий по практике применения…" onSubmit={(text, attachments) => add(text, null, attachments)} />

      {comments.length > 0 && (
        <div className={s.sortRow}>
          <SortPills options={SORT_PILLS} sortBy={sortBy} sortDir={sortDir} onChange={setSort} compact />
        </div>
      )}

      {loading ? (
        <div className={s.loading}>
          <Loader size="md" label="" />
        </div>
      ) : roots.length === 0 ? (
        <p className={s.muted}>Пока нет комментариев. Будьте первым!</p>
      ) : (
        <div className={s.list}>
          {roots.map((comment) => (
            <RtnCommentItem
              key={comment.id}
              comment={comment}
              all={comments}
              depth={0}
              onReply={(text, parentId, attachments) => add(text, parentId, attachments)}
              onDelete={(id) => void remove(id)}
              onReact={react}
            />
          ))}
        </div>
      )}
    </section>
  );
}
