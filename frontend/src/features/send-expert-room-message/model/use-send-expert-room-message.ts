"use client";

import { useReducer } from "react";
import { sendExpertRoomMessage } from "@/entities/expert-room";
import type { ExpertRoomMessage } from "@/entities/expert-room";
import type { LocalFile } from "@/shared/lib/local-file";
import { useLocalFiles } from "@/shared/lib/use-local-files";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { useNotifications } from "@/shared/ui/notifications";
import { MAX_EXPERT_ROOM_FILE_SIZE, MAX_EXPERT_ROOM_FILES } from "../config/files";
import { INITIAL_SEND_EXPERT_ROOM_MESSAGE_STATE, sendExpertRoomMessageReducer } from "./reducer";

/** Хранит черновик сообщения всем исполнителям и отправляет его; ввод текста сообщает коллегам. */
export function useSendExpertRoomMessage(
  onSent: (message: ExpertRoomMessage) => void,
  onTyping: () => void,
) {
  const previews = useLocalFiles();
  const { showError } = useNotifications();
  const [state, dispatch] = useReducer(
    sendExpertRoomMessageReducer,
    INITIAL_SEND_EXPERT_ROOM_MESSAGE_STATE,
  );
  const canSend = !state.isSending && (state.text.trim() !== "" || state.files.length > 0);

  /** Меняет текст и сообщает коллегам, что пользователь печатает. */
  function changeText(value: string) {
    dispatch({
      type: "text/change",
      value,
    });

    if (value.length > 0) {
      onTyping();
    }
  }

  /** Прикладывает выбранные файлы, если не превышены число и размер. */
  function addFiles(picked: FileList | null) {
    const added = picked ? [...picked] : [];
    const largeFile = added.find((file) => file.size > MAX_EXPERT_ROOM_FILE_SIZE);

    if (state.files.length + added.length > MAX_EXPERT_ROOM_FILES) {
      showError(`Можно прикрепить не больше ${MAX_EXPERT_ROOM_FILES} файлов`);
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

    dispatch({ type: "submit/start" });

    try {
      const message = await sendExpertRoomMessage(
        state.text.trim(),
        state.files.map((item) => item.file),
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
