/** Вид чата в Telegram. */
export type ChannelKind = "channel" | "group" | "supergroup";

/** Подключённый канал или группа и может ли бот туда публиковать. */
export interface PosterChannel {
  id: number;
  kind: ChannelKind;
  title: string;
  username: string | null;
  members_count: number | null;
  can_post: boolean;
  is_active: boolean;
}
