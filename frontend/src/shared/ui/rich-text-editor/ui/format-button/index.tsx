"use client";

import { useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import type { FormatTool } from "../../model/types";
import { EditorButton } from "../editor-button";

/** Редактор, кнопка оформления и блокировка панели. */
interface FormatButtonProps {
  editor: Editor;
  tool: FormatTool;
  disabled: boolean;
}

/** Применяет оформление к выделенному тексту и подсвечивается, когда оно уже есть. */
export function FormatButton({ editor, tool, disabled }: FormatButtonProps) {
  const Icon = tool.icon;
  const isActive = useEditorState({
    editor,
    selector: ({ editor: current }) => tool.isActive(current),
  });

  /** Переключает оформление выделения. */
  function format() {
    tool.run(editor);
  }

  return (
    <EditorButton
      label={tool.label}
      pressed={isActive}
      disabled={disabled}
      onClick={format}
    >
      <Icon />
    </EditorButton>
  );
}
