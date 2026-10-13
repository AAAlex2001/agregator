"use client";

import type { Editor } from "@tiptap/react";
import { useState } from "react";
import { writePostWithAi } from "@/source/entities/posts";
import { useNotifications } from "@/source/shared/ui/Notifications";

export interface AiAssistant {
  instruction: string;
  setInstruction: (value: string) => void;
  isPending: boolean;
  ask: (editor: Editor, request: string) => Promise<void>;
}

/** Просьба к ИИ-помощнику: ответ заменяет текст в редакторе. */
export function useAiAssistant(): AiAssistant {
  const { showError } = useNotifications();
  const [instruction, setInstruction] = useState("");
  const [isPending, setIsPending] = useState(false);

  const ask = async (editor: Editor, request: string) => {
    setIsPending(true);
    try {
      const html = await writePostWithAi(request, editor.getHTML());
      editor.commands.setContent(html, { emitUpdate: true });
      setInstruction("");
    } catch (error) {
      showError((error as Error).message);
    } finally {
      setIsPending(false);
    }
  };

  return { instruction, setInstruction, isPending, ask };
}
