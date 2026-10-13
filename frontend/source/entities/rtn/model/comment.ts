import type { RtnFile } from "./clarification";

export type RtnCommentReaction = "USEFUL" | "CLARIFICATION" | "AGREE";

export interface RtnCommentCounters {
  useful_count: number;
  clarification_count: number;
  agree_count: number;
  my_reaction: RtnCommentReaction | null;
}

export interface RtnComment extends RtnCommentCounters {
  id: number;
  parent_id: number | null;
  text: string;
  author: { name: string; is_expert: boolean };
  attachments: RtnFile[];
  created_at: string;
  is_mine: boolean;
}
