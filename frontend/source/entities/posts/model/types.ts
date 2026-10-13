export type PostStatus = "draft" | "published" | "hidden";

export const POSTS_PAGE_SIZE = 20;

export interface PostMedia {
  id: number;
  kind: "photo" | "video";
  url: string;
}

export interface PostAuthor {
  id: number;
  name: string | null;
  avatar_url: string | null;
}

export interface RepostedPost {
  id: number;
  author: PostAuthor;
  html: string;
  media: PostMedia[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Post extends RepostedPost {
  excerpt: string;
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

export interface PostPage {
  items: Post[];
  total: number;
}

export interface PostPayload {
  html: string;
  media_ids: number[];
  draft: boolean;
}

export interface PostLikes {
  liked: boolean;
  likes_count: number;
}

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

export interface CommentThread {
  comment: PostComment;
  replies: PostComment[];
}

export interface ThreadPage {
  items: CommentThread[];
  total: number;
  comments_count: number;
}

export interface PostFeedQuery {
  mode: "following" | "my" | "saved" | "reposts";
  status?: PostStatus;
}
