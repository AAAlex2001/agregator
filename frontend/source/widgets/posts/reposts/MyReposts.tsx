"use client";

import { useSession } from "@/source/entities/session";
import { PostList } from "../list/PostList";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "../posts.module.scss";

/** Свои репосты, включая репосты с комментарием. */
export function MyReposts() {
  const { user } = useSession();
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
        key={user?.id}
        query={{ mode: "reposts" }}
        emptyTitle="Репостов пока нет"
        emptyText="Нажмите на стрелки под постом, чтобы поделиться им у себя."
      />
    </div>
  );
}
