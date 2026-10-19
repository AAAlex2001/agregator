import type { ComponentType } from "react";
import {
  BookmarkIcon,
  NewspaperIcon,
  RepostIcon,
  SquarePenIcon,
  TelegramIcon,
} from "@/shared/ui/icons";

/** Раздел публикаций в меню рядом с лентой. */
interface PostsSection {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

/** Меню раздела публикаций. */
export const POSTS_SECTIONS: PostsSection[] = [
  {
    href: "/posts",
    label: "Лента",
    icon: NewspaperIcon,
  },
  {
    href: "/posts/my",
    label: "Мои посты",
    icon: SquarePenIcon,
  },
  {
    href: "/posts/channels",
    label: "Каналы и группы",
    icon: TelegramIcon,
  },
  {
    href: "/posts/saved",
    label: "Сохранённое",
    icon: BookmarkIcon,
  },
  {
    href: "/posts/reposts",
    label: "Репосты",
    icon: RepostIcon,
  },
];
