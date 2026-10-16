import type { PostStatus } from "@/entities/post";

/** Вкладка своих публикаций и подсказка под ней. */
interface MyPostTab {
  status: PostStatus;
  label: string;
  hint: string;
}

/** Вкладки своих публикаций в прежнем порядке. */
export const MY_POST_TABS: MyPostTab[] = [
  {
    status: "published",
    label: "Публикации",
    hint: "Ваши опубликованные записи. Управление — в меню публикации.",
  },
  {
    status: "draft",
    label: "Черновики",
    hint: "Черновики видите только вы. Опубликовать — через «Изменить» в меню.",
  },
  {
    status: "hidden",
    label: "Скрытые",
    hint: "Публикации, скрытые модератором. Их видите только вы.",
  },
];
