import type { ChannelKind, PosterChannel } from "./types";

/** Канал или группа: для пользователя супергруппа — тоже группа. */
function kindLabel(kind: ChannelKind): string {
  return kind === "channel" ? "Канал" : "Группа";
}

/** Вид, публичное имя и число участников одной строкой. */
export function describeChannel(channel: PosterChannel): string {
  const parts = [kindLabel(channel.kind)];

  if (channel.username) {
    parts.push(`@${channel.username}`);
  }

  if (channel.members_count !== null) {
    parts.push(`${channel.members_count.toLocaleString("ru-RU")} участников`);
  }

  return parts.join(" · ");
}

/** Почему в канал нельзя публиковать, или null, если можно. */
export function channelProblem(channel: PosterChannel): string | null {
  if (!channel.is_active) {
    return "Бота удалили из чата — добавьте его снова администратором";
  }

  if (!channel.can_post) {
    return "У бота нет права публиковать — выдайте его в настройках администратора";
  }

  return null;
}
