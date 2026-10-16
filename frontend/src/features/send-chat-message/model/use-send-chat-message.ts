"use client";

import { useReducer } from "react";
import { sendChatMessage } from "@/entities/chat";
import type { ChatMessageData } from "@/entities/chat";
import type { LocalFile } from "@/shared/lib/local-file";
import { useLocalFiles } from "@/shared/lib/use-local-files";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { useNotifications } from "@/shared/ui/notifications";
import { MAX_CHAT_FILE_SIZE, MAX_CHAT_FILES } from "../config/files";
import { INITIAL_SEND_CHAT_MESSAGE_STATE, sendChatMessageReducer } from "./reducer";

/**
 * Хранит черновик сообщения и отправляет его. Повтор после ошибки уходит с тем же
 * clientMessageId, поэтому сервер не создаст дубль; изменённый черновик получает новый.
 */
export function useSendChatMessage(
  chatUuid: string,
  onSent: (message: ChatMessageData) => void,
) {
  const previews = useLocalFiles();
  const { showError } = useNotifications();
  const [state, dispatch] = useReducer(sendChatMessageReducer, INITIAL_SEND_CHAT_MESSAGE_STATE);
  const canSend = !state.isSending && (state.text.trim() !== "" || state.files.length > 0);

  /** Меняет текст сообщения. */
  function changeText(value: string) {
    dispatch({
      type: "text/change",
      value,
    });
  }

  /** Прикладывает выбранные файлы, если не превышены число и размер. */
  function addFiles(picked: FileList | null) {
    const added = picked ? [...picked] : [];
    const largeFile = added.find((file) => file.size > MAX_CHAT_FILE_SIZE);

    if (state.files.length + added.length > MAX_CHAT_FILES) {
      showError(`Можно прикрепить не больше ${MAX_CHAT_FILES} файлов`);
      return;
    }

    if (largeFile) {
      showError(`Файл ${largeFile.name} больше 100 МБ не поддерживается`);
      return;
    }

    dispatch({
      type: "files/add",
      files: added.map(previews.createFile),
    });
  }

  /** Убирает файл из черновика и освобождает его предпросмотр. */
  function removeFile(selected: LocalFile) {
    previews.removeFile(selected);
    dispatch({
      type: "files/remove",
      file: selected,
    });
  }

  /** Показывает долю отправленных файлов. */
  function changeProgress(progress: number) {
    dispatch({
      type: "submit/progress",
      progress,
    });
  }

  /** Отправляет черновик; при ошибке оставляет текст и файлы для повтора. */
  async function send() {
    if (!canSend) {
      return;
    }

    const clientMessageId = state.clientMessageId ?? crypto.randomUUID();

    dispatch({
      type: "submit/start",
      clientMessageId,
    });

    try {
      const message = await sendChatMessage(
        chatUuid,
        {
          text: state.text.trim(),
          files: state.files.map((item) => item.file),
          clientMessageId,
        },
        changeProgress,
      );

      previews.clearFiles();
      dispatch({ type: "submit/success" });
      onSent(message);
    } catch (error) {
      dispatch({ type: "submit/error" });
      showError(error instanceof Error ? error.message : "Не удалось отправить сообщение");
    }
  }

  const items: FileGalleryItem[] = state.files.map((selected) => ({
    id: selected.previewUrl,
    name: selected.file.name,
    url: selected.previewUrl,
    onRemove: () => removeFile(selected),
  }));

  return {
    state,
    items,
    canSend,
    changeText,
    addFiles,
    send,
  };
}
