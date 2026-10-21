"use client";

import cn from "classnames";
import type { Post } from "@/entities/post";
import { BookmarkIcon } from "@/shared/ui/icons";
import { ToolButton } from "@/shared/ui/tool-button";
import { useSavePost } from "../../model/use-save-post";
import styles from "./style.module.scss";

/** Публикация и вход для гостя. */
interface SavePostButtonProps {
  post: Post;
  onLogin: () => void;
}

/** Закладка: сохраняет публикацию, чтобы вернуться к ней позже. */
export function SavePostButton({ post, onLogin }: SavePostButtonProps) {
  const {
    saved,
    isSending,
    toggleSave,
  } = useSavePost(post, onLogin);
  const label = saved ? "Убрать из сохранённого" : "Сохранить";

  return (
    <ToolButton
      label={label}
      pressed={saved}
      disabled={isSending}
      className={cn(styles.save, { [styles.saved]: saved })}
      onClick={toggleSave}
    >
      <BookmarkIcon />
    </ToolButton>
  );
}
