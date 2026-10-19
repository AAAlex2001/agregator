"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { Post } from "@/entities/post";
import { Button } from "@/shared/ui/button";
import { AiEditIcon, EyeIcon } from "@/shared/ui/icons";
import { RichTextEditor } from "@/shared/ui/rich-text-editor";
import type { EditorPanel } from "@/shared/ui/rich-text-editor";
import { Switch } from "@/shared/ui/switch";
import type { PostTarget } from "../../model/types";
import { useAiAssistant } from "../../model/use-ai-assistant";
import { usePostForm } from "../../model/use-post-form";
import { AiPanel } from "../ai-panel";
import { ChannelPicker } from "../channel-picker";
import { PostMediaPicker } from "../post-media-picker";
import { TelegramPreview } from "../telegram-preview";
import styles from "./style.module.scss";

/** Своя публикация для правки и куда пишется пост: в ленту сайта или в Telegram. */
interface PostFormProps {
  post?: Post;
  target: PostTarget;
}

/**
 * Текст с ИИ-помощником, фото и видео, сохранение черновиком или публикация.
 * Для Telegram — выбор каналов, показ в ленте сайта и предпросмотр.
 */
export function PostForm({ post, target }: PostFormProps) {
  const {
    state,
    sentIds,
    changeHtml,
    changeOnSite,
    toggleChannel,
    uploadMedia,
    removeMedia,
    save,
  } = usePostForm(post, target);
  const assistant = useAiAssistant();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isSaving = state.savingMode !== null;
  const isEmpty = !state.html && state.media.length === 0;
  const hasTarget = state.onSite || state.channelIds.length > 0;
  const isLocked = isSaving || state.isMediaBusy || assistant.isPending;
  const isMediaLocked = sentIds.length > 0;
  const aiPanel: EditorPanel = {
    label: "Написать с ИИ",
    icon: AiEditIcon,
    content: (
      <AiPanel
        assistant={assistant}
        disabled={isSaving}
      />
    ),
  };

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
      <RichTextEditor
        ariaLabel="Текст публикации"
        placeholder="Что у вас нового?"
        defaultValue={state.html}
        disabled={isSaving || assistant.isPending}
        panel={aiPanel}
        onChange={changeHtml}
      />
      {isMediaLocked ? (
        <p className={styles.note}>Пост уже вышел в Telegram: фото и видео в нём изменить нельзя, только текст.</p>
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
        <section className={styles.telegram}>
          <h2 className={styles.sectionTitle}>Где опубликовать</h2>
          <ChannelPicker
            selectedIds={state.channelIds}
            sentIds={sentIds}
            disabled={isLocked}
            onToggle={toggleChannel}
          />
          <Switch
            id="post-on-site"
            checked={state.onSite}
            onChange={changeOnSite}
            label="Также в ленте сайта"
            description="Пост появится в разделе «Публикации» на сайте"
            disabled={isLocked}
          />
          <Button
            variant="outline"
            size="sm"
            className={styles.previewButton}
            disabled={isEmpty}
            onClick={() => setIsPreviewOpen(true)}
          >
            <EyeIcon />
            Предпросмотр в Telegram
          </Button>
          <TelegramPreview
            html={state.html}
            media={state.media}
            open={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
          />
        </section>
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
            Опубликовать
          </Button>
        </div>
      </div>
    </form>
  );
}
