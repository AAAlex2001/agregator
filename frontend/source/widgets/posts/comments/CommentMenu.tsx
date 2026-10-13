"use client";

import { useState } from "react";
import { deleteComment, FlagIcon, PencilIcon, TrashIcon, type PostComment } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { ReportModal } from "@/source/features/posts/report";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { ActionMenu, type MenuAction } from "@/source/shared/ui/ActionMenu";
import { ConfirmModal } from "@/source/shared/ui/ConfirmModal";
import { useNotifications } from "@/source/shared/ui/Notifications";

interface CommentMenuProps {
  comment: PostComment;
  onEdit: () => void;
  onDeleted: () => void;
}

/** Меню комментария: свой — изменить и удалить, чужой — пожаловаться. */
export function CommentMenu({ comment, onEdit, onDeleted }: CommentMenuProps) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const { showSuccess } = useNotifications();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const remove = async () => {
    await deleteComment(comment.id);
    setIsDeleteOpen(false);
    showSuccess("Комментарий удалён");
    onDeleted();
  };

  const actions: MenuAction[] =
    user?.id === comment.author.id
      ? [
          { label: "Изменить", icon: <PencilIcon />, onClick: onEdit },
          { label: "Удалить", icon: <TrashIcon />, danger: true, onClick: () => setIsDeleteOpen(true) },
        ]
      : [{ label: "Пожаловаться", icon: <FlagIcon />, onClick: () => (user ? setIsReportOpen(true) : openAuth("login")) }];

  return (
    <>
      <ActionMenu label="Действия с комментарием" actions={actions} />
      <ConfirmModal
        open={isDeleteOpen}
        title="Удалить комментарий?"
        description="Комментарий и ответы на него будут удалены."
        confirmLabel="Удалить"
        onConfirm={remove}
        onCancel={() => setIsDeleteOpen(false)}
      />
      {isReportOpen && <ReportModal id={comment.id} kind="comment" onClose={() => setIsReportOpen(false)} />}
    </>
  );
}
