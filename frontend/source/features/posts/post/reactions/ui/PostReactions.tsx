"use client";

import cn from "classnames";
import Link from "next/link";
import type { Post } from "@/source/entities/posts";
import { ActionMenu } from "@/source/features/posts/action-menu";
import {
  BookmarkIcon,
  HeartIcon,
  MessageCircleIcon,
  PencilIcon,
  RepostIcon,
  ShareIcon,
} from "@/source/entities/posts/ui/icons";
import { usePostReactions } from "../model/usePostReactions";
import s from "./reactions.module.scss";

/** Панель лайков, комментариев, репостов и сохранения. */
export function PostReactions({ post, onUnsaved }: { post: Post; onUnsaved?: () => void }) {
  const state = usePostReactions(post, onUnsaved);
  const commentedRepost = state.signedIn
    ? { label: "Репост с комментарием", icon: <PencilIcon />, href: `/posts/${post.id}/repost` }
    : {
        label: "Репост с комментарием",
        icon: <PencilIcon />,
        onClick: () => state.openAuth("login"),
      };
  return (
    <div className={s.reactions}>
      <div className={s.panel}>
        <button
          type="button"
          className={cn(s.tool, state.liked && s.liked)}
          disabled={state.busy}
          aria-label={state.liked ? "Убрать лайк" : "Нравится"}
          aria-pressed={state.liked}
          onClick={() => state.react("like")}
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
          disabled={state.busy}
          trigger={
            <>
              <RepostIcon />
              <span>{state.reposts}</span>
            </>
          }
          actions={[
            { label: "Репостнуть", icon: <RepostIcon />, onClick: () => state.react("repost") },
            commentedRepost,
          ]}
        />
        <button
          type="button"
          className={cn(s.tool, state.saved && s.saved)}
          disabled={state.busy}
          aria-label={state.saved ? "Убрать из сохранённого" : "Сохранить"}
          aria-pressed={state.saved}
          onClick={() => state.react("save")}
        >
          <BookmarkIcon />
        </button>
        <button
          type="button"
          className={s.tool}
          aria-label="Поделиться"
          onClick={state.share}
        >
          <ShareIcon />
        </button>
      </div>
      {state.notice && (
        <p
          className={s.notice}
          role="status"
        >
          {state.notice}
        </p>
      )}
      {state.error && (
        <p
          className={s.error}
          role="alert"
        >
          {state.error}
        </p>
      )}
    </div>
  );
}
