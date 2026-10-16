import type { PostComment } from "@/entities/post";

/** Публикация, правимый комментарий или комментарий, на который отвечают. */
export interface CommentFormOptions {
  postId: number;
  comment?: PostComment;
  replyTo?: PostComment;
  onSaved: () => void;
}
