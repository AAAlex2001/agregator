"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { editorExtensions } from "../model/extensions";
import type { EditorPanel } from "../model/types";
import { EditorToolbar } from "./EditorToolbar";
import { EditorCounter } from "./EditorCounter";
import s from "./PostRichEditor.module.scss";

interface Props {
  ariaLabel: string;
  placeholder: string;
  value: string;
  limit?: number;
  disabled?: boolean;
  panel?: EditorPanel;
  onChange: (html: string) => void;
}

/** Редактор публикации с оформлением, ссылками и счётчиком символов. */
export function PostRichEditor({
  ariaLabel,
  placeholder,
  value,
  limit = 5000,
  disabled = false,
  panel,
  onChange,
}: Props) {
  const [panelOpen, setPanelOpen] = useState(false);
  const editor = useEditor({
    extensions: editorExtensions(placeholder, limit),
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: s.field,
        "aria-label": ariaLabel,
        role: "textbox",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor: current }) =>
      onChange(current.isEmpty ? "" : current.getHTML()),
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
