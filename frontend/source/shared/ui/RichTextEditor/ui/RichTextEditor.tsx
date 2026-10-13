"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { editorExtensions } from "../model/extensions";
import type { EditorPanel } from "../model/types";
import { EditorCounter } from "./EditorCounter";
import { EditorToolbar } from "./EditorToolbar";
import s from "./RichTextEditor.module.scss";

interface RichTextEditorProps {
  ariaLabel: string;
  placeholder: string;
  defaultValue: string;
  limit?: number;
  disabled?: boolean;
  panel?: EditorPanel;
  onChange: (html: string) => void;
}

/**
 * Редактор текста с оформлением, ссылками, смайликами и счётчиком символов.
 * Текст задаётся один раз при открытии.
 */
export function RichTextEditor({
  ariaLabel,
  placeholder,
  defaultValue,
  limit = 5000,
  disabled = false,
  panel,
  onChange,
}: RichTextEditorProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [setup] = useState(() => ({
    extensions: editorExtensions(placeholder, limit),
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: s.field,
        "aria-label": ariaLabel,
        role: "textbox",
        "aria-multiline": "true",
      },
    },
  }));
  const editor = useEditor({
    ...setup,
    onUpdate: ({ editor: current }) => {
      const html = current.isEmpty ? "" : current.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) {
    return (
      <textarea
        className={s.field}
        aria-label={ariaLabel}
        placeholder={placeholder}
        defaultValue=""
        readOnly
      />
    );
  }

  return (
    <div className={s.editor}>
      {panel && panelOpen && panel.render(editor)}
      <EditorToolbar
        editor={editor}
        panel={panel}
        panelOpen={panelOpen}
        disabled={disabled}
        onPanelToggle={() => setPanelOpen(!panelOpen)}
      />
      <div className={s.body}>
        <EditorContent editor={editor} />
        <EditorCounter editor={editor} limit={limit} />
      </div>
    </div>
  );
}
