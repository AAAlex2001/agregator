"use client";

import type { FormEvent } from "react";
import type { Post } from "@/entities/post";
import { Button } from "@/shared/ui/button";
import { AiEditIcon, FileIcon } from "@/shared/ui/icons";
import { RichTextEditor } from "@/shared/ui/rich-text-editor";
import type { EditorPanel } from "@/shared/ui/rich-text-editor";
import type { PostTarget } from "../../model/types";
import { useAiAssistant } from "../../model/use-ai-assistant";
import { usePostForm } from "../../model/use-post-form";
import { AiPanel } from "../ai-panel";
import { PostMediaPicker } from "../post-media-picker";
import { ReplyBanner } from "../reply-banner";
import { TelegramPublishing } from "../telegram-publishing";
import { TemplatesPanel } from "../templates-panel";
import styles from "./style.module.scss";

/** Своя публикация для правки, куда пишется пост и на какой свой пост он отвечает. */
interface PostFormProps {
  post?: Post;
  target: PostTarget;
  replyTo?: Post | null;
}

/** Ещё не вышедший пост можно отложить: новый, черновик или уже отложенный. */
function canSchedule(post?: Post): boolean {
  return !post || post.status === "draft" || post.status === "scheduled";
}

/**
 * Текст с ИИ-помощником и шаблонами, фото и видео, сохранение черновиком или публикация.
 * Для Telegram — каналы, кнопки, опрос, настройки и предпросмотр.
 */
export function PostForm({ post, target, replyTo = null }: PostFormProps) {
  const {
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
  } = usePostForm(post, target, replyTo);
  const assistant = useAiAssistant();
  const isSaving = state.savingMode !== null;
  const isEmpty = !state.html && state.media.length === 0 && state.telegram.poll === null;
  const hasTarget = state.onSite || state.channelIds.length > 0;
  const isLocked = isSaving || state.isMediaBusy || assistant.isPending;
  const panels: EditorPanel[] = [
    {
      label: "Написать с ИИ",
      icon: AiEditIcon,
      content: (
        <AiPanel
          assistant={assistant}
          disabled={isSaving}
        />
      ),
    },
    {
      label: "Шаблоны текста",
      icon: FileIcon,
      content: <TemplatesPanel />,
    },
  ];

  /** Публикует пост по кнопке «Опубликовать» или Enter. */
  function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void save("publish");
  }

  return (
    <form
      className={styles.form}
      onSubmit={publish}
    >
      {state.replyTo && (
        <ReplyBanner
          post={state.replyTo}
          onClear={clearReply}
        />
      )}
      <RichTextEditor
        ariaLabel="Текст публикации"
        placeholder="Что у вас нового?"
        defaultValue={state.html}
        disabled={isSaving || assistant.isPending}
        panels={panels}
        onChange={changeHtml}
      />
      {sentIds.length > 0 ? (
        <p className={styles.note}>
          Пост уже вышел в Telegram: фото и видео в нём изменить нельзя, только текст.
        </p>
      ) : (
        <PostMediaPicker
          files={state.media}
          disabled={isLocked}
          isBusy={state.isMediaBusy}
          onUpload={uploadMedia}
          onRemove={removeMedia}
        />
      )}
      {target === "telegram" && (
        <TelegramPublishing
          state={state}
          sentIds={sentIds}
          canSchedule={canSchedule(post)}
          disabled={isLocked}
          onToggleChannel={toggleChannel}
          onOnSiteChange={changeOnSite}
          onTelegramChange={changeTelegram}
          onScheduleChange={changeSchedule}
        />
      )}
      <div className={styles.actions}>
        <Button
          variant="transparent"
          href="/posts/my"
          disabled={isSaving}
        >
          Отмена
        </Button>
        <div className={styles.save}>
          <Button
            variant="outline"
            isLoading={state.savingMode === "draft"}
            disabled={isLocked || isEmpty}
            onClick={() => save("draft")}
          >
            В черновик
          </Button>
          <Button
            type="submit"
            isLoading={state.savingMode === "publish"}
            disabled={isLocked || isEmpty || !hasTarget}
          >
            {state.scheduledAt ? "Запланировать" : "Опубликовать"}
          </Button>
        </div>
      </div>
    </form>
  );
}
