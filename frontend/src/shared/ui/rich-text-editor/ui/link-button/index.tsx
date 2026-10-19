"use client";

import { useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import { useState } from "react";
import { LinkIcon } from "@/shared/ui/icons";
import { EditorButton } from "../editor-button";
import { LinkModal } from "../link-modal";

/** Редактор и блокировка панели инструментов. */
interface LinkButtonProps {
  editor: Editor;
  disabled: boolean;
}

/** Делает выделенный текст ссылкой или снимает ссылку. */
export function LinkButton({ editor, disabled }: LinkButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = useEditorState({
    editor,
    selector: ({ editor: current }) => current.isActive("link"),
  });

  /** Снимает ссылку с выделения или открывает окно адреса. */
  function toggleLink() {
    if (isActive) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    setIsOpen(true);
  }

  /** Ставит ссылку на выделение; без выделения вставляет сам адрес ссылкой. */
  function addLink(href: string) {
    setIsOpen(false);

    if (editor.state.selection.empty) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: href,
          marks: [
            {
              type: "link",
              attrs: { href },
            },
          ],
        })
        .run();
      return;
    }

    editor.chain().focus().setLink({ href }).run();
  }

  return (
    <>
      <EditorButton
        label="Вставить ссылку"
        pressed={isActive}
        disabled={disabled}
        onClick={toggleLink}
      >
        <LinkIcon />
      </EditorButton>
      {isOpen && (
        <LinkModal
          onClose={() => setIsOpen(false)}
          onSave={addLink}
        />
      )}
    </>
  );
}
