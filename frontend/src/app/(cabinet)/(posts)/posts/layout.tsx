import type { ReactNode } from "react";
import { PostsSiteShell } from "../../../ui/shells/posts-site-shell";

/** Страницы раздела публикаций. */
interface PostsSectionLayoutProps {
  children: ReactNode;
}

/** Общая оболочка публичных и личных страниц публикаций. */
export default function PostsSectionLayout({ children }: PostsSectionLayoutProps) {
  return <PostsSiteShell>{children}</PostsSiteShell>;
}
