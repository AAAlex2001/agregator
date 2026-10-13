"use client";

import { useState } from "react";
import { deletePost, type Post } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { ConfirmModal } from "@/source/shared/ui/ConfirmModal";
import { ActionMenu, type MenuAction } from "@/source/features/posts/action-menu";
import {
  FlagIcon,
  PencilIcon,
  TrashIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@/source/entities/posts/ui/icons";
import { useFollowAuthor } from "../../feed/follow-author/useFollowAuthor";
import { ReportModal } from "../../report/ReportModal";
import s from "./menu.module.scss";

/** Показывает владельцу правку и удаление, остальным — подписку и жалобу. */
export function PostMenu({ post, onDeleted }: { post: Post; onDeleted: () => void }) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const follow = useFollowAuthor(post.author.id, post.following);
  const [confirm, setConfirm] = useState(false);
  const [report, setReport] = useState(false);
  const remove = async () => {
    await deletePost(post.id);
    setConfirm(false);
    onDeleted();
  };
  const complain = () => {
    if (user) setReport(true);
    else openAuth("login");
  };
  const actions: MenuAction[] =
    post.author.id === user?.id
      ? [
          { label: "Изменить", icon: <PencilIcon />, href: `/posts/${post.id}/edit` },
          { label: "Удалить", icon: <TrashIcon />, danger: true, onClick: () => setConfirm(true) },
        ]
      : [
          {
            label: follow.following ? "Отписаться" : "Подписаться",
            icon: follow.following ? <UserMinusIcon /> : <UserPlusIcon />,
            onClick: follow.toggle,
          },
          { label: "Пожаловаться", icon: <FlagIcon />, onClick: complain },
        ];
  return (
    <div className={s.root}>
      <ActionMenu
        label="Действия с публикацией"
        actions={actions}
        disabled={follow.busy}
      />
      {follow.error && (
        <p
          className={s.error}
          role="alert"
        >
          {follow.error}
        </p>
      )}
      <ConfirmModal
        open={confirm}
        title="Удалить публикацию?"
        description="Публикация и комментарии к ней будут удалены."
        confirmLabel="Удалить"
        onConfirm={remove}
        onCancel={() => setConfirm(false)}
      />
      {report && (
        <ReportModal
          id={post.id}
          kind="post"
          onClose={() => setReport(false)}
        />
      )}
    </div>
  );
}
