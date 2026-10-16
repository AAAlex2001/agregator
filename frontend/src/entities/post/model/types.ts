/** Состояние публикации: черновик, опубликованная или скрытая запись. */
export type PostStatus = "draft" | "published" | "hidden";

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

/** Публикация из API с её содержимым, счётчиками и отметками посетителя. */
export interface Post extends RepostedPost {
  title: string;
  description: string;
  cover_url: string | null;
  repost_of: RepostedPost | null;
  status: PostStatus;
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

/** Текст, прикреплённые файлы и режим сохранения публикации. */
export interface PostPayload {
  html: string;
  media_ids: number[];
  draft: boolean;
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
