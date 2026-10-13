"use client";

import { useRef, useState } from "react";
import {
  createPost,
  updatePost,
  type Post,
  type PostMedia,
} from "@/source/entities/posts";

/** Сохраняет публикацию или черновик и защищает от повторной отправки. */
export function usePostForm(post?: Post) {
  const [html, setHtml] = useState(post?.html ?? "");
  const [pending, setPending] = useState<"draft" | "publish" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const saving = useRef(false);

  /** Отправляет текст и вложения с выбранным статусом. */
  async function save(draft: boolean, media: PostMedia[]) {
    if (saving.current) return null;
    saving.current = true;
    setPending(draft ? "draft" : "publish");
    setError(null);

    try {
      const payload = { html, media_ids: media.map((file) => file.id), draft };
      return await (post ? updatePost(post.id, payload) : createPost(payload));
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Не удалось сохранить публикацию",
      );
      saving.current = false;
      setPending(null);
      return null;
    }
  }

  return { html, setHtml, pending, error, save };
}
