"use client";

import { useState } from "react";
import { copyPostLink, repostPost, togglePostLike, togglePostSave, type Post } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { useNotifications } from "@/source/shared/ui/Notifications";

/** Лайк, сохранение, репост и ссылка на публикацию. Гостю вместо действия предлагается войти. */
export function usePostReactions(post: Post, onUnsaved?: () => void) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const { showSuccess, showError } = useNotifications();
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes_count);
  const [saved, setSaved] = useState(post.saved);
  const [reposts, setReposts] = useState(post.reposts_count);
  const [isBusy, setIsBusy] = useState(false);

  const run = async (action: () => Promise<void>) => {
    if (!user) return openAuth("login");
    setIsBusy(true);
    try {
      await action();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось выполнить действие");
    } finally {
      setIsBusy(false);
    }
  };

  const like = () =>
    run(async () => {
      const result = await togglePostLike(post.id, !liked);
      setLiked(result.liked);
      setLikes(result.likes_count);
    });

  const save = () =>
    run(async () => {
      await togglePostSave(post.id, !saved);
      setSaved(!saved);
      showSuccess(saved ? "Публикация убрана из сохранённого" : "Публикация сохранена");
      if (saved) onUnsaved?.();
    });

  const repost = () =>
    run(async () => {
      await repostPost(post.id, "");
      setReposts(reposts + 1);
      showSuccess("Репост опубликован — он во вкладке «Репосты»");
    });

  const share = async () => {
    try {
      await copyPostLink(post.id);
      showSuccess("Ссылка скопирована");
    } catch {
      showError("Не удалось скопировать ссылку");
    }
  };

  return { signedIn: Boolean(user), openAuth, isBusy, liked, likes, saved, reposts, like, save, repost, share };
}
