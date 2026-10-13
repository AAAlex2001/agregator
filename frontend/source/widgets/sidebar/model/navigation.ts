import type { UserRole } from "@/source/entities/user";
import {
  ReviewIcon,
  TabChatIcon,
  TabNotificationIcon,
  TabOrdersIcon,
  TabProfileIcon,
  TabSupportIcon,
} from "@/source/shared/ui/icons";
import { NewspaperIcon } from "@/source/shared/ui/icons/NewspaperIcon";
import type { SidebarSection } from "./types";

const communication: SidebarSection = {
  label: "Общение",
  items: [
    { href: "/posts", label: "Публикации", icon: NewspaperIcon },
    {
      href: "/chat",
      label: "Чаты",
      icon: TabChatIcon,
      activePaths: ["/chat", "/expert/room"],
    },
    { href: "/support", label: "Поддержка", icon: TabSupportIcon },
  ],
};

const account: SidebarSection = {
  label: "Аккаунт",
  items: [
    { href: "/settings", label: "Настройки", icon: TabProfileIcon },
    { href: "/notifications", label: "Уведомления", icon: TabNotificationIcon },
  ],
};

export const SIDEBAR_SECTIONS: Record<UserRole, SidebarSection[]> = {
  EXPERT: [
    {
      label: "Работа",
      items: [
        {
          href: "/expert/orders",
          label: "Заказы",
          icon: TabOrdersIcon,
          activePaths: ["/expert/orders", "/responses", "/archive"],
        },
      ],
    },
    communication,
    account,
  ],
  CUSTOMER: [
    {
      label: "Работа",
      items: [
        {
          href: "/customer/orders",
          label: "Заказы",
          icon: TabOrdersIcon,
          activePaths: ["/customer/orders", "/responses", "/archive", "/customer/reports"],
        },
      ],
    },
    communication,
    account,
  ],
  LICENSE_HOLDER: [
    {
      label: "Исполнители",
      items: [
        { href: "/expert-reviews", label: "Отзывы исполнителей", icon: ReviewIcon },
      ],
    },
    {
      label: "Общение",
      items: [
        { href: "/posts", label: "Публикации", icon: NewspaperIcon },
        { href: "/support", label: "Поддержка", icon: TabSupportIcon },
      ],
    },
    account,
  ],
};
