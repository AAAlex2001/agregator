export type PostStatus = "published" | "draft" | "hidden";
export type ReportStatus = "open" | "resolved";

export interface PostAuthor {
  id: number;
  name: string | null;
  avatar_url: string | null;
}

export interface PostMedia {
  id: number;
  kind: "photo" | "video";
  url: string;
}

export interface OriginalPost {
  id: number;
  author: PostAuthor;
  html: string;
  media: PostMedia[];
  created_at: string;
  published_at: string | null;
}

export interface Post extends OriginalPost {
  status: PostStatus;
  repost_of: OriginalPost | null;
  likes_count: number;
  comments_count: number;
  reposts_count: number;
  views_count: number;
}

export interface PostList {
  items: Post[];
  total: number;
}

export interface PostComment {
  id: number;
  post_id: number;
  author: PostAuthor;
  text: string;
  created_at: string;
}

export interface PostReport {
  id: number;
  reporter: PostAuthor;
  post: Post | null;
  comment: PostComment | null;
  reason: string;
  status: ReportStatus;
  created_at: string;
}

export interface ReportList {
  items: PostReport[];
  total: number;
}

export const POST_STATUSES: { value: PostStatus; label: string }[] = [
  { value: "published", label: "Опубликованные" },
  { value: "draft", label: "Черновики" },
  { value: "hidden", label: "Скрытые" },
];

export const REPORT_STATUSES: { value: ReportStatus; label: string }[] = [
  { value: "open", label: "Ждут решения" },
  { value: "resolved", label: "Рассмотренные" },
];
