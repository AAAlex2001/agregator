import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { PostList } from "../list/PostList";
import s from "../posts.module.scss";

/** Свои репосты, с комментарием и без. */
export function MyReposts() {
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
        query={{ mode: "reposts" }}
        emptyTitle="Репостов пока нет"
        emptyText="Нажмите на стрелки под постом, чтобы поделиться им у себя."
        emptyAction={{ label: "Перейти в ленту", href: "/posts" }}
      />
    </div>
  );
}
