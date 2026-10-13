"use client";

import cn from "classnames";
import Link from "next/link";
import {
  BookmarkIcon,
  HeartIcon,
  MessageCircleIcon,
  PencilIcon,
  RepostIcon,
  ShareIcon,
  type Post,
} from "@/source/entities/posts";
import { ActionMenu } from "@/source/shared/ui/ActionMenu";
import { usePostReactions } from "../model/usePostReactions";
import s from "./reactions.module.scss";

interface PostReactionsProps {
  post: Post;
  onUnsaved?: () => void;
}

/** Нижняя панель публикации: лайк, комментарии, репост, сохранение и ссылка. */
export function PostReactions({ post, onUnsaved }: PostReactionsProps) {
  const state = usePostReactions(post, onUnsaved);
  const quickRepost = {
    label: "Репостнуть",
    icon: <RepostIcon />,
    onClick: state.repost,
  };
  const commentedRepost = state.signedIn
    ? {
        label: "Репост с комментарием",
        icon: <PencilIcon />,
        href: `/posts/${post.id}/repost`,
      }
    : {
        label: "Репост с комментарием",
        icon: <PencilIcon />,
        onClick: () => state.openAuth("login"),
      };

  return (
    <div className={s.panel}>
      <button
        type="button"
        className={cn(s.tool, { [s.liked]: state.liked })}
        disabled={state.isBusy}
        aria-label={state.liked ? "Убрать лайк" : "Нравится"}
        aria-pressed={state.liked}
        onClick={state.like}
      >
        <HeartIcon />
        <span>{state.likes}</span>
      </button>
      <Link
        className={s.tool}
        aria-label="Комментарии"
        href={`/posts/${post.id}#comments`}
      >
        <MessageCircleIcon />
        <span>{post.comments_count}</span>
      </Link>
      <ActionMenu
        label="Репост"
        disabled={state.isBusy}
        trigger={
          <>
            <RepostIcon />
            <span>{state.reposts}</span>
          </>
        }
        actions={[quickRepost, commentedRepost]}
      />
      <button
        type="button"
        className={cn(s.tool, { [s.saved]: state.saved })}
        disabled={state.isBusy}
        aria-label={state.saved ? "Убрать из сохранённого" : "Сохранить"}
        aria-pressed={state.saved}
        onClick={state.save}
      >
        <BookmarkIcon />
      </button>
      <button
        type="button"
        className={s.tool}
        aria-label="Скопировать ссылку"
        onClick={state.share}
      >
        <ShareIcon />
      </button>
    </div>
  );
}
