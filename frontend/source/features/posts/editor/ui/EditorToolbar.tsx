"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import { TOOLS } from "../model/tools";
import type { EditorPanel } from "../model/types";
import { EmojiButton } from "./EmojiButton";
import { LinkButton } from "./LinkButton";
import s from "./PostRichEditor.module.scss";

interface Props {
  editor: Editor;
  panel?: EditorPanel;
  panelOpen: boolean;
  disabled: boolean;
  onPanelToggle: () => void;
}

/** Кнопки оформления выделенного текста. */
export function EditorToolbar({
  editor,
  panel,
  panelOpen,
  disabled,
  onPanelToggle,
}: Props) {
  const active = useEditorState({
    editor,
    selector: ({ editor: current }): Record<string, boolean> => ({
      heading2: current.isActive("heading", { level: 2 }),
      heading3: current.isActive("heading", { level: 3 }),
      bold: current.isActive("bold"),
      italic: current.isActive("italic"),
      underline: current.isActive("underline"),
      bulletList: current.isActive("bulletList"),
      orderedList: current.isActive("orderedList"),
      blockquote: current.isActive("blockquote"),
      link: current.isActive("link"),
    }),
  });

  return (
    <div className={s.toolbar} role="toolbar" aria-label="Оформление текста">
      {panel && (
        <button
          type="button"
          className={s.tool}
          aria-label={panel.label}
          title={panel.label}
          aria-pressed={panelOpen}
          disabled={disabled}
          onClick={onPanelToggle}
        >
          <panel.Icon />
        </button>
      )}
      {TOOLS.map(({ name, label, Icon, run }) => (
        <button
          key={name}
          type="button"
          className={s.tool}
          title={label}
          aria-label={label}
          aria-pressed={active[name]}
          disabled={disabled}
          onClick={() => run(editor)}
        >
          <Icon />
        </button>
      ))}
      <LinkButton editor={editor} active={active.link} disabled={disabled} />
      <EmojiButton editor={editor} disabled={disabled} />
    </div>
  );
}
