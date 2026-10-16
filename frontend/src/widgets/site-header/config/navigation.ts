import type { GuestCapability, HeaderDirection, HeaderLink } from "../model/types";

/** Основные страницы в настольном и мобильном меню гостя. */
export const HEADER_LINKS: HeaderLink[] = [
  { href: "/orders", label: "Заявки" },
  { href: "/news", label: "Новости" },
  { href: "/blog", label: "Блог" },
  { href: "/posts", label: "Публикации" },
  { href: "/reviews", label: "Отзывы" },
];

/** Сервисы в гостевом меню; до регистрации отображаются заблокированными. */
export const GUEST_CAPABILITIES: GuestCapability[] = [
  {
    id: "license",
    label: "Держатели разрешительных документов",
    color: "amber",
    hasSubmenu: true,
  },
  {
    id: "labor",
    label: "Трудовые ресурсы",
    color: "amber",
    hasSubmenu: true,
  },
  {
    id: "edu",
    label: "Учебный центр",
    color: "indigo",
    hasSubmenu: true,
  },
  {
    id: "useful",
    label: "Полезные ссылки",
    color: "green",
    hasSubmenu: true,
  },
  {
    id: "tech",
    label: "ТехЭксперт",
    color: "indigo",
    hasSubmenu: false,
    logo: true,
  },
  {
    id: "rtn",
    label: "РОСТЕХНАДЗОР отвечает",
    color: "gold",
    hasSubmenu: true,
  },
  {
    id: "help-expert",
    label: "Помощь исполнителю",
    color: "green",
    hasSubmenu: true,
  },
  {
    id: "help-customer",
    label: "Помощь заказчику",
    color: "green",
    hasSubmenu: true,
  },
  {
    id: "reviews",
    label: "Все отзывы",
    color: "red",
    hasSubmenu: true,
  },
];

/** Направления в бегущей строке с исходным порядком и адресами страниц. */
export const HEADER_DIRECTIONS: HeaderDirection[] = [
  {
    href: "/ekspertiza-promyshlennoy-bezopasnosti",
    label: "Экспертиза промышленной безопасности",
    icon: "helmet",
  },
  {
    href: "/audit-supb",
    label: "Аудит СУПБ",
    icon: "shield",
  },
  {
    href: "/tehnicheskoe-diagnostirovanie",
    label: "Техническое диагностирование",
    icon: "gauge",
  },
  {
    href: "/proektirovanie",
    label: "Проектирование объектов",
    icon: "ruler",
  },
  {
    href: "/inzhenernye-izyskaniya",
    label: "Инженерные изыскания",
    icon: "compass",
  },
  {
    href: "/ekologiya",
    label: "Экологическое сопровождение",
    icon: "leaf",
  },
  {
    href: "/nir",
    label: "НИР и лабораторные исследования",
    icon: "flask",
  },
  {
    href: "/kadastrovye-raboty",
    label: "Кадастровые работы",
    icon: "map",
  },
  {
    href: "/sudebnaya-ekspertiza",
    label: "Судебная экспертиза",
    icon: "scales",
  },
];
