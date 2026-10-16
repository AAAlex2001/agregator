"use client";

import { useState } from "react";
import type { PostComment } from "@/entities/post";
import { useUser } from "@/entities/user";
import { DeleteCommentDialog } from "@/features/delete-post-comment";
import { ReportPostModal } from "@/features/report-post";
import { ActionMenu } from "@/shared/ui/action-menu";
import type { MenuAction } from "@/shared/ui/action-menu";
import { FlagIcon, PencilIcon, TrashIcon } from "@/shared/ui/icons";
import { usePostsLogin } from "../../model/login-context";

/** Комментарий, начало правки и действие после удаления. */
interface CommentMenuProps {
  comment: PostComment;
  onEdit: () => void;
  onDeleted: () => void;
}

/** Меню комментария: свой — изменить и удалить, чужой — пожаловаться. */
export function CommentMenu({ comment, onEdit, onDeleted }: CommentMenuProps) {
  const { user } = useUser();
  const openLogin = usePostsLogin();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const isOwn = user?.id === comment.author.id;

  /** Открывает жалобу, а гостю — окно входа. */
  function openReport() {
    if (!user) {
      openLogin();
      return;
    }

    setIsReportOpen(true);
  }

  /** Закрывает подтверждение и перечитывает обсуждение. */
  function finishDeletion() {
    setIsDeleteOpen(false);
    onDeleted();
  }

  const ownActions: MenuAction[] = [
    {
      label: "Изменить",
      icon: <PencilIcon />,
      onClick: onEdit,
    },
    {
      label: "Удалить",
      icon: <TrashIcon />,
      danger: true,
      onClick: () => setIsDeleteOpen(true),
    },
  ];
  const readerActions: MenuAction[] = [
    {
      label: "Пожаловаться",
      icon: <FlagIcon />,
      onClick: openReport,
    },
  ];
  const actions = isOwn ? ownActions : readerActions;

  return (
    <>
      <ActionMenu
        label="Действия с комментарием"
        actions={actions}
      />
      <DeleteCommentDialog
        commentId={comment.id}
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDeleted={finishDeletion}
      />
      {isReportOpen && (
        <ReportPostModal
          id={comment.id}
          target="comment"
          onClose={() => setIsReportOpen(false)}
        />
      )}
    </>
  );
}
