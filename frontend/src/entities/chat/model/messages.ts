import type {
  ChatAttachment,
  ChatMessageData,
  ChatMessageGroup,
} from "./types";

/** Объединяет подряд идущие сообщения одного отправителя под одной подписью. */
export function groupChatMessages(messages: ChatMessageData[]): ChatMessageGroup[] {
  const initialGroups: ChatMessageGroup[] = [];

  return messages.reduce((groups, message) => {
    const lastGroup = groups.at(-1);

    if (lastGroup?.senderId === message.sender_id) {
      return [
        ...groups.slice(0, -1),
        { ...lastGroup, messages: [...lastGroup.messages, message] },
      ];
    }

    return [
      ...groups,
      {
        senderId: message.sender_id,
        senderRole: message.sender_role,
        messages: [message],
      },
    ];
  }, initialGroups);
}

/** Добавляет сообщение в конец переписки или обновляет уже показанное. */
export function addChatMessage(
  messages: ChatMessageData[],
  message: ChatMessageData,
): ChatMessageData[] {
  const isShown = messages.some((item) => item.id === message.id);

  if (!isShown) {
    return [...messages, message];
  }

  return messages.map((item) => {
    if (item.id !== message.id) {
      return item;
    }

    return message;
  });
}

/** Отмечает прочитанными сообщения, о которых сообщил сервер. */
export function markMessagesRead(
  messages: ChatMessageData[],
  messageIds: number[],
): ChatMessageData[] {
  return messages.map((message) => {
    if (!messageIds.includes(message.id)) {
      return message;
    }

    return { ...message, is_read: true };
  });
}

/** Отмечает прочитанными входящие сообщения, которые сервер прочитал при открытии чата. */
export function readIncomingMessages(
  messages: ChatMessageData[],
  currentUserId: number,
): ChatMessageData[] {
  return messages.map((message) => {
    if (message.sender_id === currentUserId) {
      return message;
    }

    return { ...message, is_read: true };
  });
}

/** Возвращает вложения; у старых сообщений единственный файл лежит в file_url. */
export function getMessageAttachments(message: ChatMessageData): ChatAttachment[] {
  if (message.attachments.length > 0) {
    return message.attachments;
  }

  if (!message.file_url) {
    return [];
  }

  return [
    {
      url: message.file_url,
      name: message.file_name || "Файл",
    },
  ];
}
