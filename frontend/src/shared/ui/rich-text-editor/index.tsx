"use client";

import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { createEditorExtensions } from "./model/extensions";
import type { EditorPanel } from "./model/types";
import { EditorCounter } from "./ui/editor-counter";
import { EditorToolbar } from "./ui/editor-toolbar";
import styles from "./style.module.scss";

/** Подписи, начальный текст, лимит и дополнительная панель редактора. */
interface RichTextEditorProps {
  ariaLabel: string;
  placeholder: string;
  defaultValue: string;
  disabled?: boolean;
  panel?: EditorPanel;
  onChange: (html: string) => void;
}

/** Наибольшая длина текста, которую принимает сервер. */
const TEXT_LIMIT = 5000;

/**
 * Редактор текста с оформлением, ссылками, смайликами и счётчиком символов.
 * Текст задаётся один раз при открытии; пустой редактор отдаёт пустую строку.
 */
export function RichTextEditor({
  ariaLabel,
  placeholder,
  defaultValue,
  disabled = false,
  panel,
  onChange,
}: RichTextEditorProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [setup] = useState(() => ({
    extensions: createEditorExtensions(placeholder, TEXT_LIMIT),
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: styles.field,
        "aria-label": ariaLabel,
        role: "textbox",
        "aria-multiline": "true",
      },
    },
  }));
  const editor = useEditor({
    ...setup,
    onUpdate: ({ editor: current }) => {
      onChange(current.isEmpty ? "" : current.getHTML());
    },
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) {
    return (
      <textarea
        className={styles.field}
        aria-label={ariaLabel}
        placeholder={placeholder}
        defaultValue=""
        readOnly
      />
    );
  }

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className={styles.editor}>
        {panel && isPanelOpen && panel.content}
        <EditorToolbar
          editor={editor}
          panel={panel}
          isPanelOpen={isPanelOpen}
          disabled={disabled}
          onPanelToggle={() => setIsPanelOpen(!isPanelOpen)}
        />
        <div className={styles.body}>
          <EditorContent editor={editor} />
          <EditorCounter
            editor={editor}
            limit={TEXT_LIMIT}
          />
        </div>
      </div>
    </EditorContext.Provider>
  );
}

export type { EditorPanel } from "./model/types";
