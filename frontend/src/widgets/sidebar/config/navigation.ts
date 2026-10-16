import type { UserRole } from "@/entities/user";
import {
  NewspaperIcon,
  ReviewIcon,
  TabChatIcon,
  TabNotificationIcon,
  TabOrdersIcon,
  TabProfileIcon,
  TabSupportIcon,
} from "@/shared/ui/icons";
import type { SidebarSection } from "../model/types";

/** Разделы общения для исполнителя и заказчика. */
const COMMUNICATION_SECTION: SidebarSection = {
  label: "Общение",
  items: [
    {
      href: "/posts",
      label: "Публикации",
      icon: NewspaperIcon,
    },
    {
      href: "/chat",
      label: "Чаты",
      icon: TabChatIcon,
      activePaths: ["/chat", "/expert/room"],
    },
    {
      href: "/support",
      label: "Поддержка",
      icon: TabSupportIcon,
    },
  ],
};

/** Настройки и уведомления доступны всем ролям. */
const ACCOUNT_SECTION: SidebarSection = {
  label: "Аккаунт",
  items: [
    {
      href: "/settings",
      label: "Настройки",
      icon: TabProfileIcon,
    },
    {
      href: "/notifications",
      label: "Уведомления",
      icon: TabNotificationIcon,
    },
  ],
};

/** Меню исполнителя с заказами, общением и настройками. */
const EXPERT_SECTIONS: SidebarSection[] = [
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
  COMMUNICATION_SECTION,
  ACCOUNT_SECTION,
];

/** Меню заказчика включает отчёты в активную область заказов. */
const CUSTOMER_SECTIONS: SidebarSection[] = [
  {
    label: "Работа",
    items: [
      {
        href: "/customer/orders",
        label: "Заказы",
        icon: TabOrdersIcon,
        activePaths: [
          "/customer/orders",
          "/responses",
          "/archive",
          "/customer/reports",
        ],
      },
    ],
  },
  COMMUNICATION_SECTION,
  ACCOUNT_SECTION,
];

/** Меню лицензиата с отзывами исполнителей и без раздела чатов. */
const LICENSE_HOLDER_SECTIONS: SidebarSection[] = [
  {
    label: "Исполнители",
    items: [
      {
        href: "/expert-reviews",
        label: "Отзывы исполнителей",
        icon: ReviewIcon,
      },
    ],
  },
  {
    label: "Общение",
    items: [
      {
        href: "/posts",
        label: "Публикации",
        icon: NewspaperIcon,
      },
      {
        href: "/support",
        label: "Поддержка",
        icon: TabSupportIcon,
      },
    ],
  },
  ACCOUNT_SECTION,
];

/** Возвращает меню текущей роли; до загрузки профиля ссылки скрыты. */
export function getSidebarSections(role: UserRole | null): SidebarSection[] {
  switch (role) {
    case "EXPERT":
      return EXPERT_SECTIONS;
    case "CUSTOMER":
      return CUSTOMER_SECTIONS;
    case "LICENSE_HOLDER":
      return LICENSE_HOLDER_SECTIONS;
    default:
      return [];
  }
}
