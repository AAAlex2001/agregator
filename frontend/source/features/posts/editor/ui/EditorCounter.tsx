"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import s from "./PostRichEditor.module.scss";

interface Props {
  editor: Editor;
  limit: number;
}

/** Показывает длину текста и доступный лимит. */
export function EditorCounter({ editor, limit }: Props) {
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
