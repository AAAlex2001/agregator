"use client";

import { useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import styles from "./style.module.scss";

/** Редактор и наибольшая длина текста. */
interface EditorCounterProps {
  editor: Editor;
  limit: number;
}

/** Показывает длину текста и доступный лимит. */
export function EditorCounter({ editor, limit }: EditorCounterProps) {
  const count = useEditorState({
    editor,
    selector: ({ editor: current }) => current.storage.characterCount.characters(),
  });

  return (
    <p className={styles.counter}>
      {count} / {limit} символов
    </p>
  );
}
