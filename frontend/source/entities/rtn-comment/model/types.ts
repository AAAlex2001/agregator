export type CommentReactionValue = "USEFUL" | "CLARIFICATION" | "AGREE";

export type RtnCommentSortBy = "useful_count" | "created_at" | "is_expert";

export interface RtnCommentAttachment {
  name: string;
  url: string;
}

export interface RtnCommentAuthor {
  name: string;
  is_expert: boolean;
}

export interface RtnComment {
  id: number;
  parent_id: number | null;
  text: string;
  author: RtnCommentAuthor;
  attachments: RtnCommentAttachment[];
  created_at: string;
  is_mine: boolean;
  useful_count: number;
  clarification_count: number;
  agree_count: number;
  my_reaction: CommentReactionValue | null;
}
