import type { Post } from "@/source/entities/posts";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { PostList } from "../list/PostList";
import s from "../posts.module.scss";

interface MyRepostsProps {
  posts: Post[];
  nextPageHref?: string;
}

/** Свои репосты, с комментарием и без. */
export function MyReposts({ posts, nextPageHref }: MyRepostsProps) {
  return (
    <div className={s.section}>
      <div className={s.heading}>
        <Title as="h1" text="Репосты" />
        <Subtitle
          text="Записи, которыми вы поделились в своей ленте, с комментарием или без."
          className={s.subtitle}
        />
      </div>
      <PostList
        posts={posts}
        nextPageHref={nextPageHref}
        emptyTitle="Репостов пока нет"
        emptyText="Нажмите на стрелки под постом, чтобы поделиться им у себя."
        emptyActionLabel="Перейти в ленту"
        emptyActionHref="/posts"
      />
    </div>
  );
}
