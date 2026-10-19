import type { PostStatus } from "@/entities/post";

/** Вкладка своих постов и подсказка под ней. */
interface MyPostTab {
  status: PostStatus;
  label: string;
  hint: string;
}

/** Вкладки своих постов. */
export const MY_POST_TABS: MyPostTab[] = [
  {
    status: "published",
    label: "Опубликованные",
    hint: "Вышедшие посты: на сайте и в Telegram-каналах. Статус отправки — на карточке.",
  },
  {
    status: "scheduled",
    label: "Запланированные",
    hint: "Посты выйдут в назначенное время. Изменить время — кнопкой «Изменить» на карточке.",
  },
  {
    status: "draft",
    label: "Черновики",
    hint: "Черновики видите только вы. Опубликовать — кнопкой «Изменить» на карточке.",
  },
  {
    status: "hidden",
    label: "Скрытые",
    hint: "Посты, скрытые модератором на сайте. Их видите только вы.",
  },
];
