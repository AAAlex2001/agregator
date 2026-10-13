"use client";

import {
  deleteComment,
  deletePost,
  dismissReport,
  setPostStatus,
  type PostReport,
} from "@/entities/posts";
import Button from "@/shared/ui/button";
import ConfirmModal from "@/shared/ui/confirm-modal";
import { useModeration } from "../model/use-moderation";
import styles from "./style.module.scss";

type ReportActionsProps = {
  report: PostReport;
  onDone: () => void;
};

/** Принимает решение по жалобе на пост или комментарий. */
export function ReportActions({ report, onDone }: ReportActionsProps) {
  const moderation = useModeration();
  const { post, comment } = report;

  function remove() {
    if (comment) {
      return moderation.run(() => deleteComment(comment.id), onDone);
    }

    if (post) return moderation.run(() => deletePost(post.id), onDone);
  }

  return (
    <div className={styles.actions}>
      {post?.status === "published" && (
        <Button
          variant="outline"
          disabled={moderation.pending}
          onClick={() => moderation.run(() => setPostStatus(post.id, "hidden"), onDone)}
        >
          Скрыть пост
        </Button>
      )}
      {(post || comment) && (
        <Button variant="danger" disabled={moderation.pending} onClick={moderation.askRemove}>
          {comment ? "Удалить комментарий" : "Удалить пост"}
        </Button>
      )}
      <Button
        variant="ghost"
        disabled={moderation.pending}
        onClick={() => moderation.run(() => dismissReport(report.id), onDone)}
      >
        Отклонить жалобу
      </Button>

      <ConfirmModal
        open={moderation.confirming}
        title={comment ? "Удалить комментарий?" : "Удалить публикацию?"}
        text={comment
          ? "Комментарий и ответы на него будут удалены без возможности восстановления."
          : "Публикация, её файлы, репосты и комментарии будут удалены без возможности восстановления."}
        confirmLabel="Удалить"
        pending={moderation.pending}
        onCancel={moderation.cancelRemove}
        onConfirm={remove}
      />
    </div>
  );
}
