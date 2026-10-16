"use client";

import type { Editor } from "@tiptap/react";
import { useState } from "react";
import { writePostWithAi } from "@/entities/post";
import { useNotifications } from "@/shared/ui/notifications";
import type { AiAssistant } from "./types";

/** Просьба к ИИ-помощнику: его ответ заменяет текст в редакторе. */
export function useAiAssistant(): AiAssistant {
  const { showError } = useNotifications();
  const [instruction, setInstruction] = useState("");
  const [isPending, setIsPending] = useState(false);

  /** Отправляет просьбу и текущий текст, затем подставляет ответ в редактор. */
  async function ask(editor: Editor, request: string) {
    setIsPending(true);

    try {
      const html = await writePostWithAi(request, editor.getHTML());

      editor.commands.setContent(html, { emitUpdate: true });
      setInstruction("");
    } catch (error) {
      showError(error instanceof Error ? error.message : "ИИ-помощник сейчас недоступен");
    } finally {
      setIsPending(false);
    }
  }

  return {
    instruction,
    isPending,
    setInstruction,
    ask,
  };
}
