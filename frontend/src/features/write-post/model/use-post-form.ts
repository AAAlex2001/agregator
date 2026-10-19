"use client";

import { useRouter } from "next/navigation";
import { useReducer } from "react";
import {
  createPost,
  deletePostMedia,
  updatePost,
  uploadPostMedia,
} from "@/entities/post";
import type { Post, PostMedia, TelegramOptions } from "@/entities/post";
import { useNotifications } from "@/shared/ui/notifications";
import { MAX_POST_MEDIA } from "../config/media";
import { createPostFormState, postFormReducer } from "./reducer";
import type { PostTarget, SaveMode } from "./types";

/** Каналы, куда пост уже вышел: их не отправляют снова и не снимают. */
export function sentChannelIds(post?: Post): number[] {
  if (!post) {
    return [];
  }

  return post.deliveries
    .filter((delivery) => delivery.status === "sent")
    .map((delivery) => delivery.channel.id);
}

/** Что сказать после публикации: сохранено, запланировано или опубликовано. */
function publishMessage(isEdit: boolean, isScheduled: boolean): string {
  if (isScheduled) {
    return "Пост запланирован";
  }

  return isEdit ? "Изменения сохранены" : "Публикация опубликована";
}

/**
 * Новая публикация или правка своей: текст, фото и видео, сайт и каналы, черновик или публикация.
 * После сохранения открывает свои посты.
 */
export function usePostForm(post: Post | undefined, target: PostTarget, replyTo: Post | null) {
  const router = useRouter();
  const { showSuccess, showError } = useNotifications();
  const [state, dispatch] = useReducer(
    postFormReducer,
    { post, target, replyTo },
    createPostFormState,
  );
  const sentIds = sentChannelIds(post);

  /** Сохраняет текст из редактора. */
  function changeHtml(html: string) {
    dispatch({
      type: "html/change",
      html,
    });
  }

  /** Показывать ли пост в ленте сайта. */
  function changeOnSite(onSite: boolean) {
    dispatch({
      type: "site/change",
      onSite,
    });
  }

  /** Добавляет канал к публикации или убирает его. Уже вышедший пост из канала не снимается. */
  function toggleChannel(channelId: number) {
    if (sentIds.includes(channelId)) {
      return;
    }

    dispatch({
      type: "channel/toggle",
      channelId,
    });
  }

  /** Настройки, кнопки и опрос Telegram-поста. */
  function changeTelegram(telegram: TelegramOptions) {
    dispatch({
      type: "telegram/change",
      telegram,
    });
  }

  /** Время отложенной публикации; пустая строка — опубликовать сразу. */
  function changeSchedule(scheduledAt: string) {
    dispatch({
      type: "schedule/change",
      scheduledAt,
    });
  }

  /** Пост выйдет обычным, а не ответом. */
  function clearReply() {
    dispatch({ type: "reply/clear" });
  }

  /** Загружает выбранные файлы; формат и размер проверяет сервер. */
  async function uploadMedia(files: File[]) {
    if (state.media.length + files.length > MAX_POST_MEDIA) {
      showError(`Можно добавить не больше ${MAX_POST_MEDIA} файлов`);
      return;
    }

    dispatch({ type: "media/start" });

    try {
      const uploaded = await Promise.all(files.map(uploadPostMedia));

      dispatch({
        type: "media/add",
        files: uploaded,
      });
    } catch (error) {
      dispatch({ type: "media/error" });
      showError(error instanceof Error ? error.message : "Не удалось загрузить файл");
    }
  }

  /** Убирает файл; файлы сохранённой публикации сервер удалит при сохранении. */
  async function removeMedia(file: PostMedia) {
    const isSaved = post?.media.some((item) => item.id === file.id);

    dispatch({ type: "media/start" });

    try {
      if (!isSaved) {
        await deletePostMedia(file.id);
      }

      dispatch({
        type: "media/remove",
        file,
      });
    } catch (error) {
      dispatch({ type: "media/error" });
      showError(error instanceof Error ? error.message : "Не удалось удалить файл");
    }
  }

  /** Сохраняет публикацию черновиком или публикует и открывает свои посты. */
  async function save(mode: SaveMode) {
    dispatch({
      type: "submit/start",
      mode,
    });

    const payload = {
      html: state.html,
      media_ids: state.media.map((file) => file.id),
      draft: mode === "draft",
      on_site: state.onSite,
      channel_ids: state.channelIds.filter((id) => !sentIds.includes(id)),
      telegram: state.telegram,
      scheduled_at: state.scheduledAt || null,
      reply_to_id: state.replyTo?.id ?? null,
    };

    try {
      if (post) {
        await updatePost(post.id, payload);
      } else {
        await createPost(payload);
      }

      if (mode === "draft") {
        showSuccess("Черновик сохранён");
        router.push("/posts/my?status=draft");
        return;
      }

      showSuccess(publishMessage(Boolean(post), Boolean(state.scheduledAt)));
      router.push("/posts/my");
    } catch (error) {
      dispatch({ type: "submit/error" });
      showError(
        error instanceof Error ? error.message : "Не удалось сохранить публикацию",
      );
    }
  }

  return {
    state,
    sentIds,
    changeHtml,
    changeOnSite,
    toggleChannel,
    changeTelegram,
    changeSchedule,
    clearReply,
    uploadMedia,
    removeMedia,
    save,
  };
}
