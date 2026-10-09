import {
  ARTICLES_PATH,
  CONTACT_DEALS_PATH,
  LEADS_PATH,
  RTN_CHANGE_REPORTS_PATH,
  RTN_PATH,
  RTN_QUESTIONS_PATH,
  TAGS_PATH,
} from "@/shared/lib/admin-paths";
import { BellIcon, BriefcaseIcon, FileTextIcon, HelpCircleIcon, InboxIcon, TagIcon } from "@/shared/ui/icons";

export const ADMIN_NAV = [
  {
    title: "Контент",
    items: [
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
    title: "Продажи",
    items: [
      { href: LEADS_PATH, label: "Заявки с сайта", Icon: InboxIcon },
      { href: CONTACT_DEALS_PATH, label: "Покупка контактов", Icon: BriefcaseIcon },
    ],
  },
];
