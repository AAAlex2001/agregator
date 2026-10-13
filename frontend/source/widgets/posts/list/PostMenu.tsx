"use client";

import { useState } from "react";
import {
  copyPostLink,
  deletePost,
  ExternalLinkIcon,
  FlagIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  UserMinusIcon,
  UserPlusIcon,
  type Post,
} from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { useFollowAuthor } from "@/source/features/posts/follow-author";
import { ReportModal } from "@/source/features/posts/report";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { ActionMenu, type MenuAction } from "@/source/shared/ui/ActionMenu";
import { ConfirmModal } from "@/source/shared/ui/ConfirmModal";
import { useNotifications } from "@/source/shared/ui/Notifications";

interface PostMenuProps {
  post: Post;
  showOpen: boolean;
  onDeleted: () => void;
}

/**
 * Меню публикации. Всем — открыть и скопировать ссылку;
 * автору — правка и удаление; остальным — подписка и жалоба.
 */
export function PostMenu({ post, showOpen, onDeleted }: PostMenuProps) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const { showSuccess, showError } = useNotifications();
  const follow = useFollowAuthor(post.author.id, post.following);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const isOwn = post.author.id === user?.id;

  const copyLink = async () => {
    try {
      await copyPostLink(post.id);
      showSuccess("Ссылка скопирована");
    } catch {
      showError("Не удалось скопировать ссылку");
    }
  };

  const remove = async () => {
    await deletePost(post.id);
    setIsDeleteOpen(false);
    const message = post.repost_of ? "Репост удалён" : "Публикация удалена";
    showSuccess(message);
    onDeleted();
  };

  const openReport = () => {
    if (user) {
      setIsReportOpen(true);
    } else {
      openAuth("login");
    }
  };

  const openAction: MenuAction = {
    label: "Открыть публикацию",
    icon: <ExternalLinkIcon />,
    href: `/posts/${post.id}`,
  };
  const openActions: MenuAction[] = showOpen ? [openAction] : [];

  const linkAction: MenuAction = {
    label: "Скопировать ссылку",
    icon: <LinkIcon />,
    onClick: copyLink,
  };

  const editAction: MenuAction = {
    label: "Изменить",
    icon: <PencilIcon />,
    href: `/posts/${post.id}/edit`,
  };
  const editActions: MenuAction[] = post.repost_of ? [] : [editAction];

  const ownActions: MenuAction[] = [
    ...editActions,
    {
      label: "Удалить",
      icon: <TrashIcon />,
      danger: true,
      onClick: () => setIsDeleteOpen(true),
    },
  ];

  const followLabel = follow.following ? "Отписаться от автора" : "Подписаться на автора";
  const followIcon = follow.following ? <UserMinusIcon /> : <UserPlusIcon />;

  const readerActions: MenuAction[] = [
    {
      label: followLabel,
      icon: followIcon,
      onClick: follow.toggle,
    },
    {
      label: "Пожаловаться",
      icon: <FlagIcon />,
      onClick: openReport,
    },
  ];

  const roleActions = isOwn ? ownActions : readerActions;
  const actions = [...openActions, linkAction, ...roleActions];
  const deleteTitle = post.repost_of ? "Удалить репост?" : "Удалить публикацию?";

  return (
    <>
      <ActionMenu
        label="Действия с публикацией"
        disabled={follow.isBusy}
        actions={actions}
      />
      <ConfirmModal
        open={isDeleteOpen}
        title={deleteTitle}
        description="Публикация и комментарии к ней будут удалены без возможности восстановления."
        confirmLabel="Удалить"
        onConfirm={remove}
        onCancel={() => setIsDeleteOpen(false)}
      />
      {isReportOpen && (
        <ReportModal
          id={post.id}
          kind="post"
          onClose={() => setIsReportOpen(false)}
        />
      )}
    </>
  );
}
