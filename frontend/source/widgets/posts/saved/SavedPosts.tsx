import type { Post } from "@/source/entities/posts";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { PostList } from "../list/PostList";
import s from "../posts.module.scss";

interface SavedPostsProps {
  posts: Post[];
  nextPageHref?: string;
}

/** Публикации, которые пользователь отметил закладкой. */
export function SavedPosts({ posts, nextPageHref }: SavedPostsProps) {
  return (
    <div className={s.section}>
      <div className={s.heading}>
        <Title as="h1" text="Сохранённое" />
        <Subtitle
          text="Публикации, которые вы сохранили, чтобы вернуться к ним позже."
          className={s.subtitle}
        />
      </div>
      <PostList
        posts={posts}
        nextPageHref={nextPageHref}
        emptyTitle="Сохранённых публикаций нет"
        emptyText="Нажмите на закладку под постом, чтобы он появился здесь."
        emptyActionLabel="Перейти в ленту"
        emptyActionHref="/posts"
      />
    </div>
  );
}
