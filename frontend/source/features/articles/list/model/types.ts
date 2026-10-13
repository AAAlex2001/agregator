import type { ArticleListItem } from "@/source/entities/article";

export interface ArticlesListState {
  items: ArticleListItem[];
  hasMore: boolean;
  offset: number;
  tag: string;
  direction: string;
  isReloading: boolean;
  isLoadingMore: boolean;
}

export type ArticlesListAction =
  | { type: "filter/start"; tag: string; direction: string }
  | { type: "filter/success"; items: ArticleListItem[]; hasMore: boolean }
  | { type: "filter/error" }
  | { type: "more/start" }
  | { type: "more/success"; items: ArticleListItem[]; hasMore: boolean }
  | { type: "more/finish" };
