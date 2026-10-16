/** Время последнего сообщения в списке: сегодня — «14:05», раньше — «12.10». */
export function formatChatListTime(value: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (date.toDateString() === new Date().toDateString()) {
    return formatMessageTime(value);
  }

  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });
}

/** Время отправки сообщения: «14:05». */
export function formatMessageTime(value: string): string {
  return new Date(value).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
