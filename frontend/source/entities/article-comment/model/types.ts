export interface ArticleComment {
  id: number;
  parent_id: number | null;
  text: string;
  author_name: string;
  created_at: string;
  is_mine: boolean;
}
