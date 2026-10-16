import type { Editor } from "@tiptap/react";
import type { ComponentType, ReactNode } from "react";

/**
 * Дополнительная панель редактора: кнопка в панели инструментов открывает её над ней.
 * Содержимое получает редактор через useCurrentEditor из @tiptap/react.
 */
export interface EditorPanel {
  label: string;
  icon: ComponentType<{ className?: string }>;
  content: ReactNode;
}

/** Кнопка оформления: как проверить её состояние и что она делает с текстом. */
export interface FormatTool {
  label: string;
  icon: ComponentType<{ className?: string }>;
  isActive: (editor: Editor) => boolean;
  run: (editor: Editor) => void;
}
