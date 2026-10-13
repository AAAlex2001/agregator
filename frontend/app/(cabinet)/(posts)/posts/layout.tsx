import type { ReactNode } from "react";
import { PostsSiteShell } from "@/source/widgets/posts/layout";

/** Общая оболочка публичных и личных страниц публикаций. */
export default function PostsSectionLayout({ children }: { children: ReactNode }) {
  return <PostsSiteShell>{children}</PostsSiteShell>;
}
