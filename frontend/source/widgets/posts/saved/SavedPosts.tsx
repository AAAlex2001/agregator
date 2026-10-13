import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { PostList } from "../list/PostList";
import s from "../posts.module.scss";

/** Публикации, которые пользователь отметил закладкой. */
export function SavedPosts() {
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
        query={{ mode: "saved" }}
        emptyTitle="Сохранённых публикаций нет"
        emptyText="Нажмите на закладку под постом, чтобы он появился здесь."
        emptyAction={{ label: "Перейти в ленту", href: "/posts" }}
      />
    </div>
  );
}
