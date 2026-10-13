"use client";

import type { Post } from "@/source/entities/posts";
import Button from "@/source/shared/ui/Button";
import { RichTextEditor, type EditorPanel } from "@/source/shared/ui/RichTextEditor";
import { useAiAssistant } from "../model/useAiAssistant";
import { usePostForm } from "../model/usePostForm";
import { usePostMedia } from "../model/usePostMedia";
import { AiPanel } from "./AiPanel";
import { AiEditIcon } from "./icons";
import { PostMediaPicker } from "./PostMediaPicker";
import s from "./PostForm.module.scss";

interface PostFormProps {
  post?: Post;
}

/** Новая публикация или правка своей: текст с ИИ-помощником, фото и видео,
 *  черновик или публикация. */
export function PostForm({ post }: PostFormProps) {
  const form = usePostForm(post);
  const media = usePostMedia(post?.media ?? []);
  const assistant = useAiAssistant();
  const isSaving = form.savingMode !== null;
  const isEmpty = !form.html && media.files.length === 0;
  const isLocked = isSaving || media.isBusy || assistant.isPending;
  const aiPanel: EditorPanel = {
    label: "Написать с ИИ",
    Icon: AiEditIcon,
    render: (editor) => (
      <AiPanel
        editor={editor}
        assistant={assistant}
        disabled={isSaving}
      />
    ),
  };

  return (
    <form
      className={s.form}
      onSubmit={(event) => {
        event.preventDefault();
        void form.save("publish", media.files);
      }}
    >
      <RichTextEditor
        ariaLabel="Текст публикации"
        placeholder="Что у вас нового?"
        defaultValue={form.html}
        disabled={isSaving || assistant.isPending}
        panel={aiPanel}
        onChange={form.setHtml}
      />
      <PostMediaPicker
        files={media.files}
        disabled={isLocked}
        isBusy={media.isBusy}
        onUpload={media.upload}
        onRemove={media.remove}
      />
      <div className={s.actions}>
        <Button variant="transparent" href="/posts/my" disabled={isSaving}>
          Отмена
        </Button>
        <div className={s.save}>
          <Button
            variant="outline"
            isLoading={form.savingMode === "draft"}
            disabled={isLocked || isEmpty}
            onClick={() => form.save("draft", media.files)}
          >
            В черновик
          </Button>
          <Button
            type="submit"
            isLoading={form.savingMode === "publish"}
            disabled={isLocked || isEmpty}
          >
            Опубликовать
          </Button>
        </div>
      </div>
    </form>
  );
}
