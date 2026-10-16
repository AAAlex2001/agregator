import type { ArticleListItem } from "@/entities/article";

/** Серверные новости услуги и выбор её публичной оболочки вместо кабинета. */
export interface ServicePageContentProps {
  news: ArticleListItem[];
  isPublic?: boolean;
}
