/** Состояние публикации: черновик, опубликованная или скрытая запись. */
export type PostStatus = "draft" | "scheduled" | "published" | "hidden";

/** Фото или видео, загруженное для публикации. */
export interface PostMedia {
  id: number;
  kind: "photo" | "video";
  url: string;
}

/** Автор публикации или комментария, отображаемый рядом с текстом. */
export interface PostAuthor {
  id: number;
  name: string | null;
  avatar_url: string | null;
}

/** Исходная публикация, которую показываем внутри репоста. */
export interface RepostedPost {
  id: number;
  author: PostAuthor;
  html: string;
  media: PostMedia[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

/** Как идёт доставка поста в Telegram-канал. */
export type DeliveryStatus = "pending" | "sending" | "sent" | "failed" | "deleted";

/** Канал или группа, куда ушёл пост. */
export interface DeliveryChannel {
  id: number;
  kind: "channel" | "group" | "supergroup";
  title: string;
  username: string | null;
  can_post: boolean;
  is_active: boolean;
}

/** Пост в одном Telegram-канале: статус, ошибка, время выхода и ссылка на сообщение. */
export interface PostDelivery {
  channel: DeliveryChannel;
  status: DeliveryStatus;
  error: string | null;
  sent_at: string | null;
  message_url: string | null;
}

/** Что делает кнопка под постом: ссылка, копирование или скрытый текст для подписчиков. */
export type TelegramButtonKind = "url" | "copy" | "hidden";

/** Цвет кнопки в Telegram. */
export type TelegramButtonStyle = "primary" | "success" | "danger";

/** Кнопка под Telegram-постом. */
export interface TelegramButton {
  kind: TelegramButtonKind;
  text: string;
  value: string;
  alt: string;
  style: TelegramButtonStyle | null;
}

/** Опрос, который уходит следом за постом. */
export interface TelegramPoll {
  question: string;
  options: string[];
  is_anonymous: boolean;
  allows_multiple_answers: boolean;
}

/** Превью ссылки: как решит Telegram, без превью, маленькое или большое. */
export type LinkPreview = "auto" | "off" | "small" | "large";

/** Как пост выходит в Telegram: настройки, кнопки и опрос. */
export interface TelegramOptions {
  silent: boolean;
  protect: boolean;
  pin: boolean;
  link_preview: LinkPreview;
  link_preview_above: boolean;
  caption_above: boolean;
  auto_delete_hours: number | null;
  buttons: TelegramButton[][];
  poll: TelegramPoll | null;
}

/** Публикация из API с её содержимым, счётчиками и отметками посетителя. */
export interface Post extends RepostedPost {
  title: string;
  description: string;
  cover_url: string | null;
  repost_of: RepostedPost | null;
  status: PostStatus;
  on_site: boolean;
  deliveries: PostDelivery[];
  telegram: TelegramOptions;
  scheduled_at: string | null;
  reply_to_id: number | null;
  likes_count: number;
  comments_count: number;
  reposts_count: number;
  views_count: number;
  liked: boolean;
  saved: boolean;
  following: boolean;
}

/** Загруженные публикации и общее количество записей в разделе. */
export interface PostPage {
  items: Post[];
  total: number;
}

/** Отметка лайка посетителя и новый счётчик после её изменения. */
export interface PostLikes {
  liked: boolean;
  likes_count: number;
}

/** Текст, файлы, режим сохранения и где публиковать: на сайте и в каналах. */
export interface PostPayload {
  html: string;
  media_ids: number[];
  draft: boolean;
  on_site: boolean;
  channel_ids: number[];
  telegram: TelegramOptions;
  scheduled_at: string | null;
  reply_to_id: number | null;
}

/** Текст поста в разметке Telegram и сколько символов из лимита он занимает. */
export interface TelegramPreview {
  html: string;
  length: number;
  limit: number;
}

/** Комментарий к публикации с автором, ответом и отметкой посетителя. */
export interface PostComment {
  id: number;
  author: PostAuthor;
  text: string;
  parent_id: number | null;
  reply_to_name: string | null;
  likes_count: number;
  liked: boolean;
  created_at: string;
}

/** Основной комментарий и все ответы в его ветке. */
export interface PostCommentThread {
  comment: PostComment;
  replies: PostComment[];
}

/** Страница веток обсуждения и счётчики комментариев. */
export interface PostCommentPage {
  items: PostCommentThread[];
  total: number;
  comments_count: number;
}

/** Опубликованный оригинал поста с автором и датой изменения для карты сайта. */
export interface PostSitemapItem {
  id: number;
  author_id: number;
  updated_at: string;
}
