"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import s from "./RichTextEditor.module.scss";

interface EditorCounterProps {
  editor: Editor;
  limit: number;
}

/** Показывает длину текста и доступный лимит. */
export function EditorCounter({ editor, limit }: EditorCounterProps) {
  const count = useEditorState({
    editor,
    selector: ({ editor: current }) =>
      current.storage.characterCount.characters(),
  });
  return (
    <p className={s.counter}>
      {count} / {limit} символов
    </p>
  );
}
