import type { FooterLink } from "../model/types";

/** Публичные страницы направлений в первой колонке подвала. */
export const DIRECTION_LINKS: FooterLink[] = [
  {
    href: "/ekspertiza-promyshlennoy-bezopasnosti",
    label: "Экспертиза промышленной безопасности",
  },
  {
    href: "/proektirovanie",
    label: "Проектирование объектов",
  },
  {
    href: "/inzhenernye-izyskaniya",
    label: "Инженерные изыскания",
  },
  {
    href: "/ekologiya",
    label: "Экологическое сопровождение",
  },
  {
    href: "/audit-supb",
    label: "Аудит СУПБ",
  },
  {
    href: "/tehnicheskoe-diagnostirovanie",
    label: "Техническое диагностирование",
  },
  {
    href: "/nir",
    label: "НИР и лабораторные исследования",
  },
  {
    href: "/kadastrovye-raboty",
    label: "Кадастровые работы",
  },
  {
    href: "/sudebnaya-ekspertiza",
    label: "Судебная экспертиза",
  },
];

/** Страницы платформы и якоря разделов главной страницы. */
export const PLATFORM_LINKS: FooterLink[] = [
  {
    href: "/",
    label: "О платформе",
  },
  {
    href: "/#advantages",
    label: "Почему выбирают нас",
  },
  {
    href: "/#faq",
    label: "Частые вопросы",
  },
  {
    href: "/orders",
    label: "Заказы и тендеры",
  },
  {
    href: "/konkursnaya-komissiya",
    label: "Конкурсная комиссия",
  },
  {
    href: "/reviews",
    label: "Отзывы",
  },
  {
    href: "/news",
    label: "Новости отрасли",
  },
  {
    href: "/blog",
    label: "Блог платформы",
  },
];

/** Сервисы, доступные по отдельным адресам сайта. */
export const SERVICE_LINKS: FooterLink[] = [
  {
    href: "/zepb-registry",
    label: "Реестр заключений ЭПБ",
  },
  {
    href: "/expert-contacts",
    label: "Контакты исполнителей",
  },
  {
    href: "/rtn",
    label: "Разъяснения Ростехнадзора",
  },
  {
    href: "/rtn/ask",
    label: "Задать вопрос в Ростехнадзор",
  },
  {
    href: "/training/defectoscopist-certification",
    label: "Обучение дефектоскопистов",
  },
];

/** Юридические документы в последней колонке подвала. */
export const DOCUMENT_LINKS: FooterLink[] = [
  {
    href: "/requisites",
    label: "Реквизиты компании",
  },
  {
    href: "/offer",
    label: "Публичная оферта",
  },
  {
    href: "/user-agreement",
    label: "Пользовательское соглашение",
  },
  {
    href: "/privacy-policy",
    label: "Политика конфиденциальности",
  },
  {
    href: "/personal-data-consent",
    label: "Согласие на обработку ПДн",
  },
];
