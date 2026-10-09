"use client";

import type { Editor } from "@tiptap/react";
import { useRef } from "react";
import IconButton from "@/shared/ui/icon-button";
import {
  BoldIcon,
  FilmIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  RedoIcon,
  UndoIcon,
} from "@/shared/ui/icons";
import styles from "./style.module.scss";

type EditorToolbarProps = {
  editor: Editor;
  uploading: boolean;
  onLink: () => void;
  onImage?: (file: File) => void;
  onVideo?: (file: File) => void;
};

/** Панель редактора: форматирование, списки, цитата, ссылка, картинка и видео, отмена. */
const EditorToolbar = ({ editor, uploading, onLink, onImage, onVideo }: EditorToolbarProps) => {
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const chain = () => editor.chain().focus();

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Форматирование">
      <IconButton tone="ghost" size="sm" ariaLabel="Жирный" pressed={editor.isActive("bold")} onClick={() => chain().toggleBold().run()}>
        <BoldIcon />
      </IconButton>
      <IconButton tone="ghost" size="sm" ariaLabel="Курсив" pressed={editor.isActive("italic")} onClick={() => chain().toggleItalic().run()}>
        <ItalicIcon />
      </IconButton>

      <span className={styles.divider} />

      <IconButton
        tone="ghost"
        size="sm"
        ariaLabel="Заголовок второго уровня"
        pressed={editor.isActive("heading", { level: 2 })}
        onClick={() => chain().toggleHeading({ level: 2 }).run()}
      >
        H2
      </IconButton>
      <IconButton
        tone="ghost"
        size="sm"
        ariaLabel="Заголовок третьего уровня"
        pressed={editor.isActive("heading", { level: 3 })}
        onClick={() => chain().toggleHeading({ level: 3 }).run()}
      >
        H3
      </IconButton>

      <span className={styles.divider} />

      <IconButton tone="ghost" size="sm" ariaLabel="Список" pressed={editor.isActive("bulletList")} onClick={() => chain().toggleBulletList().run()}>
        <ListIcon />
      </IconButton>
      <IconButton tone="ghost" size="sm" ariaLabel="Нумерованный список" pressed={editor.isActive("orderedList")} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrderedIcon />
      </IconButton>
      <IconButton tone="ghost" size="sm" ariaLabel="Цитата" pressed={editor.isActive("blockquote")} onClick={() => chain().toggleBlockquote().run()}>
        <QuoteIcon />
      </IconButton>

      <span className={styles.divider} />

      <IconButton tone="ghost" size="sm" ariaLabel="Ссылка" pressed={editor.isActive("link")} onClick={onLink}>
        <LinkIcon />
      </IconButton>
      {onImage && (
        <IconButton tone="ghost" size="sm" ariaLabel="Картинка" loading={uploading} onClick={() => imageInput.current?.click()}>
          <ImageIcon />
        </IconButton>
      )}
      {onVideo && (
        <IconButton tone="ghost" size="sm" ariaLabel="Видео" loading={uploading} onClick={() => videoInput.current?.click()}>
          <FilmIcon />
        </IconButton>
      )}

      <span className={styles.divider} />

      <IconButton tone="ghost" size="sm" ariaLabel="Отменить" disabled={!editor.can().undo()} onClick={() => chain().undo().run()}>
        <UndoIcon />
      </IconButton>
      <IconButton tone="ghost" size="sm" ariaLabel="Повторить" disabled={!editor.can().redo()} onClick={() => chain().redo().run()}>
        <RedoIcon />
      </IconButton>

      <input
        ref={imageInput}
        type="file"
        hidden
        accept=".jpg,.jpeg,.png,.webp,.gif,.svg"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) onImage?.(file);
          event.target.value = "";
        }}
      />
      <input
        ref={videoInput}
        type="file"
        hidden
        accept=".mp4,.webm,.mov,.m4v"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) onVideo?.(file);
          event.target.value = "";
        }}
      />
    </div>
  );
};

export default EditorToolbar;
