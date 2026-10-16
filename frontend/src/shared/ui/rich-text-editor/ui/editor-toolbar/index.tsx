import type { Editor } from "@tiptap/react";
import { FORMAT_TOOLS } from "../../config/format-tools";
import type { EditorPanel } from "../../model/types";
import { EditorButton } from "../editor-button";
import { EmojiButton } from "../emoji-button";
import { FormatButton } from "../format-button";
import { LinkButton } from "../link-button";
import styles from "./style.module.scss";

/** Редактор, дополнительная панель и блокировка кнопок. */
interface EditorToolbarProps {
  editor: Editor;
  panel?: EditorPanel;
  isPanelOpen: boolean;
  disabled: boolean;
  onPanelToggle: () => void;
}

/** Кнопки оформления выделенного текста, ссылки и смайлики. */
export function EditorToolbar({
  editor,
  panel,
  isPanelOpen,
  disabled,
  onPanelToggle,
}: EditorToolbarProps) {
  return (
    <div
      className={styles.toolbar}
      role="toolbar"
      aria-label="Оформление текста"
    >
      {panel && (
        <EditorButton
          label={panel.label}
          pressed={isPanelOpen}
          disabled={disabled}
          onClick={onPanelToggle}
        >
          <panel.icon />
        </EditorButton>
      )}
      {FORMAT_TOOLS.map((tool) => (
        <FormatButton
          key={tool.label}
          editor={editor}
          tool={tool}
          disabled={disabled}
        />
      ))}
      <LinkButton
        editor={editor}
        disabled={disabled}
      />
      <EmojiButton
        editor={editor}
        disabled={disabled}
      />
    </div>
  );
}
