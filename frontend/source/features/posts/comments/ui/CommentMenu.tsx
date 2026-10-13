"use client";

import { useState } from "react";
import { deleteComment, type PostComment } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { ConfirmModal } from "@/source/shared/ui/ConfirmModal";
import { ActionMenu, type MenuAction } from "@/source/features/posts/action-menu";
import { FlagIcon, PencilIcon, TrashIcon } from "@/source/entities/posts/ui/icons";
import { ReportModal } from "../../report/ReportModal";

interface Props {
  comment: PostComment;
  onEdit: () => void;
  onChanged: () => void;
}

/** Даёт изменить свой комментарий, удалить его или пожаловаться на чужой. */
export function CommentMenu({ comment, onEdit, onChanged }: Props) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const [confirm, setConfirm] = useState(false);
  const [report, setReport] = useState(false);
  const remove = async () => {
    await deleteComment(comment.id);
    setConfirm(false);
    onChanged();
  };
  const complain = () => {
    if (user) setReport(true);
    else openAuth("login");
  };
  const actions: MenuAction[] =
    user?.id === comment.author.id
      ? [
          { label: "Изменить", icon: <PencilIcon />, onClick: onEdit },
          { label: "Удалить", icon: <TrashIcon />, danger: true, onClick: () => setConfirm(true) },
        ]
      : [{ label: "Пожаловаться", icon: <FlagIcon />, onClick: complain }];
  return (
    <>
      <ActionMenu
        label="Действия с комментарием"
        actions={actions}
      />
      <ConfirmModal
        open={confirm}
        title="Удалить комментарий?"
        description="Комментарий и ответы на него будут удалены."
        confirmLabel="Удалить"
        onConfirm={remove}
        onCancel={() => setConfirm(false)}
      />
      {report && (
        <ReportModal
          id={comment.id}
          kind="comment"
          onClose={() => setReport(false)}
        />
      )}
    </>
  );
}
