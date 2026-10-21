import {
  ACCOUNTS_PATH,
  ARTICLES_PATH,
  BLITZ_INVOICES_PATH,
  BLITZ_PATH,
  BLITZ_TARIFFS_PATH,
  COMMISSION_PATH,
  CONTACT_DEALS_PATH,
  DASHBOARD_PATH,
  LEADS_PATH,
  ORDERS_PATH,
  POSTS_PATH,
  POST_REPORTS_PATH,
  RTN_CHANGE_REPORTS_PATH,
  RTN_PATH,
  RTN_QUESTIONS_PATH,
  TAGS_PATH,
} from "@/shared/lib/admin-paths";
import {
  BellIcon,
  BriefcaseIcon,
  ClipboardIcon,
  DashboardIcon,
  FileTextIcon,
  HelpCircleIcon,
  InboxIcon,
  TagIcon,
  UsersIcon,
} from "@/shared/ui/icons";

export const ADMIN_NAV = [
  {
    title: "Платформа",
    items: [
      { href: DASHBOARD_PATH, label: "Дашборд", Icon: DashboardIcon },
      { href: ORDERS_PATH, label: "Заказы", Icon: ClipboardIcon },
      { href: ACCOUNTS_PATH, label: "Учётные записи", Icon: UsersIcon },
    ],
  },
  {
    title: "Контент",
    items: [
      { href: POSTS_PATH, label: "Публикации", Icon: FileTextIcon },
      { href: POST_REPORTS_PATH, label: "Жалобы на публикации", Icon: BellIcon },
      { href: ARTICLES_PATH, label: "Статьи", Icon: FileTextIcon },
      { href: TAGS_PATH, label: "Теги", Icon: TagIcon },
    ],
  },
  {
    title: "Ростехнадзор отвечает",
    items: [
      { href: RTN_PATH, label: "Разъяснения", Icon: FileTextIcon },
      { href: RTN_QUESTIONS_PATH, label: "Вопросы посетителей", Icon: HelpCircleIcon },
      { href: RTN_CHANGE_REPORTS_PATH, label: "Сообщения об изменениях", Icon: BellIcon },
    ],
  },
  {
    title: "Блиц-эксперт",
    items: [
      { href: BLITZ_PATH, label: "Заявки", Icon: ClipboardIcon },
      { href: BLITZ_INVOICES_PATH, label: "Счета", Icon: FileTextIcon },
      { href: BLITZ_TARIFFS_PATH, label: "Тарифы", Icon: TagIcon },
      { href: COMMISSION_PATH, label: "Конкурсная комиссия", Icon: UsersIcon },
    ],
  },
  {
    title: "Продажи",
    items: [
      { href: LEADS_PATH, label: "Заявки с сайта", Icon: InboxIcon },
      { href: CONTACT_DEALS_PATH, label: "Покупка контактов", Icon: BriefcaseIcon },
    ],
  },
];
