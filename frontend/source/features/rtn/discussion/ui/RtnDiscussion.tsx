"use client";

import { useState } from "react";
import type { RtnComment } from "@/source/entities/rtn";
import { SortPills, type SortPillSpec } from "@/source/shared/ui/SortPills";
import { sortComments, type CommentSort, type CommentSortBy } from "../model/sortComments";
import { useRtnComments } from "../model/useRtnComments";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import s from "./RtnDiscussion.module.scss";

const SORT_PILLS: SortPillSpec<CommentSortBy>[] = [
  { key: "useful_count", label: "Полезность", descLabel: "Сначала полезные", ascLabel: "Сначала менее полезные" },
  { key: "created_at", label: "Дата", descLabel: "Сначала новые", ascLabel: "Сначала старые" },
  { key: "is_expert", label: "Исполнители", descLabel: "Сначала исполнители", ascLabel: "Сначала не исполнители" },
];

interface RtnDiscussionProps {
  clarificationId: number;
  initialComments: RtnComment[];
}

/** Профессиональное обсуждение под разъяснением: новый комментарий, сортировка и дерево ответов. */
export function RtnDiscussion({ clarificationId, initialComments }: RtnDiscussionProps) {
  const { comments, add, remove, react } = useRtnComments(clarificationId, initialComments);
  const [sort, setSort] = useState<CommentSort>({ by: null, dir: null });
  const sorted = sortComments(comments, sort);
  const roots = sorted.filter((comment) => comment.parent_id === null);

  return (
    <section className={s.discussion} aria-label="Профессиональное обсуждение">
      <header className={s.head}>
        <h2 className={s.title}>
          Профессиональное обсуждение
          {comments.length > 0 && <span className={s.total}>{comments.length}</span>}
        </h2>
        <p className={s.subtitle}>Поделитесь практикой применения этого разъяснения или уточните спорные моменты с коллегами.</p>
      </header>

      <CommentForm
        placeholder="Ваш комментарий по практике применения…"
        onSubmit={(text, attachments) => add(text, null, attachments)}
      />

      {roots.length === 0 ? (
        <p className={s.muted}>Пока нет комментариев. Будьте первым!</p>
      ) : (
        <>
          <SortPills options={SORT_PILLS} sortBy={sort.by} sortDir={sort.dir} onChange={(by, dir) => setSort({ by, dir })} />
          <div className={s.list}>
            {roots.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                all={sorted}
                isReply={false}
                onReply={add}
                onDelete={remove}
                onReact={react}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
