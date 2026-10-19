import type { ComponentType } from "react";
import { GlobeIcon, TelegramIcon } from "@/shared/ui/icons";

/** Куда можно написать новый пост: адрес редактора, пояснение, иконка и её цвет. */
interface NewPostAction {
  href: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  tone: "telegram" | "site";
}

/** Пост в Telegram-каналы или в ленту сайта. */
export const NEW_POST_ACTIONS: NewPostAction[] = [
  {
    href: "/posts/new/telegram",
    label: "Пост в Telegram",
    description: "В ваши каналы и группы",
    icon: TelegramIcon,
    tone: "telegram",
  },
  {
    href: "/posts/new",
    label: "Пост на сайт",
    description: "В ленту «Ресурс-Плюс»",
    icon: GlobeIcon,
    tone: "site",
  },
];
