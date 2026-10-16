"use client";

import type { FormEvent } from "react";
import type { Post } from "@/entities/post";
import { Button } from "@/shared/ui/button";
import { AiEditIcon } from "@/shared/ui/icons";
import { RichTextEditor } from "@/shared/ui/rich-text-editor";
import type { EditorPanel } from "@/shared/ui/rich-text-editor";
import { useAiAssistant } from "../../model/use-ai-assistant";
import { usePostForm } from "../../model/use-post-form";
import { AiPanel } from "../ai-panel";
import { PostMediaPicker } from "../post-media-picker";
import styles from "./style.module.scss";

/** Своя публикация для правки; без неё форма создаёт новую. */
interface PostFormProps {
  post?: Post;
}

/** Текст с ИИ-помощником, фото и видео, сохранение черновиком или публикация. */
export function PostForm({ post }: PostFormProps) {
  const {
    state,
    changeHtml,
    uploadMedia,
    removeMedia,
    save,
  } = usePostForm(post);
  const assistant = useAiAssistant();
  const isSaving = state.savingMode !== null;
  const isEmpty = !state.html && state.media.length === 0;
  const isLocked = isSaving || state.isMediaBusy || assistant.isPending;
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
      <PostMediaPicker
        files={state.media}
        disabled={isLocked}
        isBusy={state.isMediaBusy}
        onUpload={uploadMedia}
        onRemove={removeMedia}
      />
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
            disabled={isLocked || isEmpty}
          >
            Опубликовать
          </Button>
        </div>
      </div>
    </form>
  );
}
