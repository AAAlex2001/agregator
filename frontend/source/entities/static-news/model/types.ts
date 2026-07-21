import type { ArticleDetail, ArticleListItem } from "@/source/entities/article";

export interface StaticNewsArticle extends ArticleDetail {
  kind: "news";
}

export interface StaticNewsIndexItem extends ArticleListItem {
  kind: "news";
  shard: number;
  updated_at: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
}
