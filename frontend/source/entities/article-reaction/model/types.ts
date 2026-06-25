export type ReactionValue = "LIKE" | "DISLIKE";

export interface ReactionState {
  likes_count: number;
  dislikes_count: number;
  my_reaction: ReactionValue | null;
}
