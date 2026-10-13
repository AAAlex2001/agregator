"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createPost,
  updatePost,
  type Post,
  type PostMedia,
} from "@/source/entities/posts";
import { useNotifications } from "@/source/shared/ui/Notifications";

type SaveMode = "draft" | "publish";

const SAVED_MESSAGES = {
  draft: "Черновик сохранён",
  publish: "Публикация опубликована",
};

/**
 * Сохранение публикации: черновиком или сразу в ленту.
 * После сохранения — к своим публикациям.
 */
export function usePostForm(post: Post | undefined) {
  const router = useRouter();
  const { showSuccess, showError } = useNotifications();
  const [html, setHtml] = useState(post?.html ?? "");
  const [savingMode, setSavingMode] = useState<SaveMode | null>(null);

  const save = async (mode: SaveMode, media: PostMedia[]) => {
    setSavingMode(mode);
    try {
      const payload = {
        html,
        media_ids: media.map((file) => file.id),
        draft: mode === "draft",
      };

      if (post) {
        await updatePost(post.id, payload);
      } else {
        await createPost(payload);
      }

      const notice = post && mode === "publish"
        ? "Изменения сохранены"
        : SAVED_MESSAGES[mode];
      showSuccess(notice);

      const nextUrl = mode === "draft" ? "/posts/my?status=draft" : "/posts/my";
      router.push(nextUrl);
    } catch (error) {
      showError((error as Error).message);
      setSavingMode(null);
    }
  };

  return {
    html,
    setHtml,
    savingMode,
    save,
  };
}
