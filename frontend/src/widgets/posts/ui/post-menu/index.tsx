"use client";

import { useState } from "react";
import type { Post } from "@/entities/post";
import { useUser } from "@/entities/user";
import { useCopyPostLink } from "@/features/copy-post-link";
import { DeletePostDialog } from "@/features/delete-post";
import { useFollowAuthor } from "@/features/follow-author";
import { ReportPostModal } from "@/features/report-post";
import { ActionMenu } from "@/shared/ui/action-menu";
import type { MenuAction } from "@/shared/ui/action-menu";
import {
  ExternalLinkIcon,
  FlagIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@/shared/ui/icons";
import { usePostsLogin } from "../../model/login-context";

/** Публикация, показ ссылки на её страницу и действие после удаления. */
interface PostMenuProps {
  post: Post;
  showOpen: boolean;
  onDeleted: () => void;
}

/**
 * Меню публикации: всем — открыть и скопировать ссылку;
 * автору — правка и удаление; остальным — подписка и жалоба.
 */
export function PostMenu({ post, showOpen, onDeleted }: PostMenuProps) {
  const { user } = useUser();
  const openLogin = usePostsLogin();
  const copyLink = useCopyPostLink(post.id);
  const follow = useFollowAuthor(post.author.id, post.following, openLogin);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const isOwn = post.author.id === user?.id;

  /** Открывает жалобу, а гостю — окно входа. */
  function openReport() {
    if (!user) {
      openLogin();
      return;
    }

    setIsReportOpen(true);
  }

  /** Закрывает подтверждение и сообщает списку об удалении. */
  function finishDeletion() {
    setIsDeleteOpen(false);
    onDeleted();
  }

  const openAction: MenuAction = {
    label: "Открыть публикацию",
    icon: <ExternalLinkIcon />,
    href: `/posts/${post.id}`,
  };
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
  const deleteAction: MenuAction = {
    label: "Удалить",
    icon: <TrashIcon />,
    danger: true,
    onClick: () => setIsDeleteOpen(true),
  };
  const followAction: MenuAction = {
    label: follow.following ? "Отписаться от автора" : "Подписаться на автора",
    icon: follow.following ? <UserMinusIcon /> : <UserPlusIcon />,
    onClick: follow.toggleFollow,
  };
  const reportAction: MenuAction = {
    label: "Пожаловаться",
    icon: <FlagIcon />,
    onClick: openReport,
  };

  const ownActions = post.repost_of ? [deleteAction] : [editAction, deleteAction];
  const roleActions = isOwn ? ownActions : [followAction, reportAction];
  const openActions = showOpen ? [openAction] : [];
  const actions = [...openActions, linkAction, ...roleActions];

  return (
    <>
      <ActionMenu
        label="Действия с публикацией"
        disabled={follow.isSending}
        actions={actions}
      />
      <DeletePostDialog
        post={post}
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDeleted={finishDeletion}
      />
      {isReportOpen && (
        <ReportPostModal
          id={post.id}
          target="post"
          onClose={() => setIsReportOpen(false)}
        />
      )}
    </>
  );
}
