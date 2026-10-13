import type { UserRole } from "@/source/entities/user";
import {
  ExpertRoomIcon,
  FileIcon,
  ReviewIcon,
  TabArchiveIcon,
  TabChatIcon,
  TabNotificationIcon,
  TabOrdersIcon,
  TabProfileIcon,
  TabResponsesIcon,
  TabSupportIcon,
} from "@/source/shared/ui/icons";
import type { SidebarSection } from "./types";

export const SIDEBAR_SECTIONS: Record<UserRole, SidebarSection[]> = {
  EXPERT: [
    {
      label: "Работа",
      items: [
        { href: "/expert/orders", label: "Все заказы", icon: TabOrdersIcon },
        { href: "/responses", label: "Мои отклики", icon: TabResponsesIcon },
        { href: "/archive", label: "Архив", icon: TabArchiveIcon },
      ],
    },
    {
      label: "Общение",
      items: [
        { href: "/chat", label: "Чат по заказам", icon: TabChatIcon },
        { href: "/expert/room", label: "Чат исполнителей", icon: ExpertRoomIcon },
        { href: "/notifications", label: "Уведомления", icon: TabNotificationIcon },
        { href: "/support", label: "Поддержка", icon: TabSupportIcon },
      ],
    },
    {
      label: "Аккаунт",
      items: [
        { href: "/settings", label: "Настройки", icon: TabProfileIcon },
      ],
    },
  ],
  CUSTOMER: [
    {
      label: "Работа",
      items: [
        { href: "/customer/orders", label: "Мои заказы", icon: TabOrdersIcon },
        { href: "/responses", label: "Отклики", icon: TabResponsesIcon },
      ],
    },
    {
      label: "Результаты тендеров",
      items: [
        { href: "/archive", label: "Архив", icon: TabArchiveIcon },
        { href: "/customer/reports", label: "Отчёты", icon: FileIcon },
      ],
    },
    {
      label: "Общение",
      items: [
        { href: "/chat", label: "Чат по заказам", icon: TabChatIcon },
        { href: "/notifications", label: "Уведомления", icon: TabNotificationIcon },
        { href: "/support", label: "Поддержка", icon: TabSupportIcon },
      ],
    },
    {
      label: "Аккаунт",
      items: [
        { href: "/settings", label: "Настройки", icon: TabProfileIcon },
      ],
    },
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
        { href: "/notifications", label: "Уведомления", icon: TabNotificationIcon },
        { href: "/support", label: "Поддержка", icon: TabSupportIcon },
      ],
    },
    {
      label: "Аккаунт",
      items: [
        { href: "/settings", label: "Настройки", icon: TabProfileIcon },
      ],
    },
  ],
};
