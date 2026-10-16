"use client";

import type { Post } from "@/entities/post";
import { ActionMenu } from "@/shared/ui/action-menu";
import type { MenuAction } from "@/shared/ui/action-menu";
import { PencilIcon, RepostIcon } from "@/shared/ui/icons";
import { useQuickRepost } from "../../model/use-quick-repost";

/** Публикация и вход для гостя. */
interface RepostMenuProps {
  post: Post;
  onLogin: () => void;
}

/** Счётчик репостов и выбор: репостнуть сразу или с комментарием. */
export function RepostMenu({ post, onLogin }: RepostMenuProps) {
  const {
    reposts,
    isSending,
    repost,
  } = useQuickRepost(post, onLogin);
  const actions: MenuAction[] = [
    {
      label: "Репостнуть",
      icon: <RepostIcon />,
      onClick: repost,
    },
    {
      label: "Репост с комментарием",
      icon: <PencilIcon />,
      href: `/posts/${post.id}/repost`,
    },
  ];

  return (
    <ActionMenu
      label="Репост"
      disabled={isSending}
      actions={actions}
      trigger={(
        <>
          <RepostIcon />
          <span>{reposts}</span>
        </>
      )}
    />
  );
}
