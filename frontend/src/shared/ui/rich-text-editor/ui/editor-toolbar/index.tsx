import type { Editor } from "@tiptap/react";
import { FORMAT_TOOLS } from "../../config/format-tools";
import type { EditorPanel } from "../../model/types";
import { EditorButton } from "../editor-button";
import { EmojiButton } from "../emoji-button";
import { FormatButton } from "../format-button";
import { LinkButton } from "../link-button";
import styles from "./style.module.scss";

/** Редактор, дополнительные панели, открытая из них и блокировка кнопок. */
interface EditorToolbarProps {
  editor: Editor;
  panels: EditorPanel[];
  openPanel: string | null;
  disabled: boolean;
  onPanelToggle: (label: string) => void;
}

/** Кнопки оформления выделенного текста, ссылки и смайлики. */
export function EditorToolbar({
  editor,
  panels,
  openPanel,
  disabled,
  onPanelToggle,
}: EditorToolbarProps) {
  return (
    <div
      className={styles.toolbar}
      role="toolbar"
      aria-label="Оформление текста"
    >
      {panels.map((panel) => (
        <EditorButton
          key={panel.label}
          label={panel.label}
          pressed={panel.label === openPanel}
          disabled={disabled}
          onClick={() => onPanelToggle(panel.label)}
        >
          <panel.icon />
        </EditorButton>
      ))}
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
