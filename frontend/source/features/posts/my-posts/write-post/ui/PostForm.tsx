"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostHead, type Post } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import Button from "@/source/shared/ui/Button";
import {
  PostRichEditor,
  type EditorPanel,
} from "@/source/features/posts/editor";
import { AiEditIcon } from "@/source/features/posts/editor/icons";
import { usePostForm } from "../model/usePostForm";
import { usePostMedia } from "../model/usePostMedia";
import { AiPanel } from "./AiPanel";
import { PostMediaPicker } from "./PostMediaPicker";
import s from "./PostForm.module.scss";

/** Форма публикации: текст, ИИ-помощник, вложения и сохранение. */
export function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const { user } = useSession();
  const form = usePostForm(post);
  const media = usePostMedia(post?.media);
  const [aiBusy, setAiBusy] = useState(false);
  const pending = form.pending !== null;
  const blocked = pending || media.busy || aiBusy;
  const empty = !form.html && media.files.length === 0;
  const panel: EditorPanel = {
    label: "Написать с ИИ",
    Icon: AiEditIcon,
    render: (editor) => (
      <AiPanel editor={editor} onBusyChange={setAiBusy} disabled={pending} />
    ),
  };

  /** Сохраняет пост и открывает нужную вкладку публикаций. */
  async function save(draft: boolean) {
    if (blocked || empty) return;
    if (!media.startSaving()) return;
    const saved = await form.save(draft, media.files);
    media.finishSaving(saved !== null);
    if (!saved) return;
    router.push(draft ? "/posts/my?status=draft" : "/posts/my");
  }

  return (
    <form
      className={s.form}
      onSubmit={(event) => {
        event.preventDefault();
        void save(false);
      }}
    >
      {user && (
        <PostHead
          author={{
            id: user.id,
            name:
              [user.first_name, user.last_name].filter(Boolean).join(" ") ||
              "Пользователь",
            avatar_url: user.avatar_url,
          }}
        />
      )}
      <PostRichEditor
        ariaLabel="Текст публикации"
        placeholder="Что у вас нового?"
        value={form.html}
        disabled={pending || aiBusy}
        panel={panel}
        onChange={form.setHtml}
      />
      <PostMediaPicker
        files={media.files}
        uploading={media.uploading}
        removing={media.removing}
        disabled={pending}
        error={media.error}
        onUpload={media.upload}
        onRemove={media.remove}
        onMove={media.move}
      />
      {form.error && (
        <p className={s.error} role="alert">
          {form.error}
        </p>
      )}
      <div className={s.actions}>
        <Button
          variant="transparent"
          disabled={pending}
          onClick={() => router.push("/posts/my")}
        >
          Отмена
        </Button>
        <div className={s.save}>
          <Button
            variant="outline"
            isLoading={form.pending === "draft"}
            disabled={blocked || empty}
            onClick={() => save(true)}
          >
            В черновик
          </Button>
          <Button
            type="submit"
            isLoading={form.pending === "publish"}
            disabled={blocked || empty}
          >
            Опубликовать
          </Button>
        </div>
      </div>
    </form>
  );
}
