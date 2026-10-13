"use client";

import { useState } from "react";
import {
  repostPost,
  togglePostLike,
  togglePostSave,
  type Post,
  type PostLikes,
} from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";

/** Выполняет реакции на публикацию; гостю предлагает войти. */
export function usePostReactions(post: Post, onUnsaved?: () => void) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const [busy, setBusy] = useState(false);
  const [likeResult, setLikeResult] = useState<PostLikes | null>(null);
  const [savedResult, setSavedResult] = useState<boolean | null>(null);
  const [repostsResult, setRepostsResult] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  // До действия показываем свежие данные поста, после — ответ на своё действие.
  const liked = likeResult?.liked ?? post.liked;
  const likes = likeResult?.likes_count ?? post.likes_count;
  const saved = savedResult ?? post.saved;
  const reposts = repostsResult ?? post.reposts_count;

  const react = async (action: "like" | "save" | "repost") => {
    if (!user) return openAuth("login");
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (action === "like") {
        const result = await togglePostLike(post.id, !liked);
        setLikeResult(result);
      }
      if (action === "save") {
        await togglePostSave(post.id, !saved);
        setSavedResult(!saved);
        if (saved) onUnsaved?.();
      }
      if (action === "repost") {
        await repostPost(post.id, "");
        setRepostsResult(reposts + 1);
        setNotice("Репост опубликован — он во вкладке «Репосты»");
      }
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Не удалось выполнить действие");
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
      setError("");
      setNotice("Ссылка скопирована");
    } catch {
      setError("Не удалось скопировать ссылку");
    }
  };
  return {
    signedIn: Boolean(user),
    openAuth,
    busy,
    liked,
    likes,
    saved,
    reposts,
    notice,
    error,
    react,
    share,
  };
}
