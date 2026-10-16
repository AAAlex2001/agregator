import type {
  ExpertRoomMessage,
  ExpertRoomMessageGroup,
  ExpertRoomTypingUser,
} from "./types";

/** Объединяет подряд идущие сообщения одного отправителя под его именем. */
export function groupExpertRoomMessages(
  messages: ExpertRoomMessage[],
): ExpertRoomMessageGroup[] {
  const initialGroups: ExpertRoomMessageGroup[] = [];

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
        senderName: message.sender_name,
        senderAvatarUrl: message.sender_avatar_url,
        messages: [message],
      },
    ];
  }, initialGroups);
}

/** Добавляет сообщение в конец, если сокет или отправка ещё не показали его. */
export function addExpertRoomMessage(
  messages: ExpertRoomMessage[],
  message: ExpertRoomMessage,
): ExpertRoomMessage[] {
  if (messages.some((item) => item.id === message.id)) {
    return messages;
  }

  return [...messages, message];
}

/** Ставит более старые сообщения перед показанными, пропуская уже известные. */
export function addOlderExpertRoomMessages(
  messages: ExpertRoomMessage[],
  older: ExpertRoomMessage[],
): ExpertRoomMessage[] {
  const shownIds = messages.map((message) => message.id);

  return [
    ...older.filter((message) => !shownIds.includes(message.id)),
    ...messages,
  ];
}

/** Подпись «… печатает…» для одного, двух или нескольких коллег. */
export function getTypingLabel(users: ExpertRoomTypingUser[]): string {
  if (users.length === 1) {
    return `${users[0].user_name} печатает…`;
  }

  if (users.length === 2) {
    return `${users[0].user_name} и ${users[1].user_name} печатают…`;
  }

  return `${users[0].user_name} и ещё ${users.length - 1} печатают…`;
}
