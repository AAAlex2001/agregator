import type { BreadcrumbItem } from "@/shared/ui/breadcrumbs";
import { isPostsPage } from "./cabinet-routes";

/** Адрес страницы и её название в цепочке навигации. */
interface PageTitle {
  path: string;
  label: string;
}

/** Страницы направлений, доступные гостю и участнику кабинета. */
const SERVICE_PAGES: PageTitle[] = [
  {
    path: "audit-supb",
    label: "Аудит СУПБ",
  },
  {
    path: "tehnicheskoe-diagnostirovanie",
    label: "Техническое диагностирование",
  },
  {
    path: "sudebnaya-ekspertiza",
    label: "Судебная экспертиза",
  },
  {
    path: "nir",
    label: "НИР и лабораторные исследования",
  },
  {
    path: "ekologiya",
    label: "Экологическое сопровождение предприятий",
  },
  {
    path: "ekspertiza-promyshlennoy-bezopasnosti",
    label: "Экспертиза промышленной безопасности",
  },
  {
    path: "kadastrovye-raboty",
    label: "Кадастровые работы",
  },
  {
    path: "proektirovanie",
    label: "Проектирование",
  },
  {
    path: "inzhenernye-izyskaniya",
    label: "Инженерные изыскания",
  },
  {
    path: "expert-contacts",
    label: "Контакты исполнителей",
  },
];

/** Разделы кабинета, которые открываются из профиля. */
const CABINET_PAGES: PageTitle[] = [
  {
    path: "/customer/orders",
    label: "Все заказы",
  },
  {
    path: "/customer/reports",
    label: "Отчёты",
  },
  {
    path: "/expert/orders",
    label: "Все заказы",
  },
  {
    path: "/expert/reviews",
    label: "Отзывы обо мне",
  },
  {
    path: "/expert-reviews",
    label: "Отзывы об исполнителях",
  },
  {
    path: "/expert/hazard",
    label: "Оценка опасности",
  },
  {
    path: "/expert/lining",
    label: "Оценка крепи",
  },
  {
    path: "/expert/room",
    label: "Чат исполнителей",
  },
  {
    path: "/labor/expert-search",
    label: "Поиск исполнителя в штат",
  },
  {
    path: "/labor/employment",
    label: "Готов к трудовому договору",
  },
  {
    path: "/responses",
    label: "Мои отклики",
  },
  {
    path: "/archive",
    label: "Архив",
  },
  {
    path: "/chat",
    label: "Чат по заказам",
  },
  {
    path: "/support",
    label: "Поддержка",
  },
  {
    path: "/notifications",
    label: "Уведомления",
  },
  {
    path: "/tech-expert",
    label: "Техэксперт",
  },
];

/** Страницы без цепочки: главные и настройки профиля. */
const ROOT_PAGES = ["/", "/landing", "/settings"];

/** Страницы, которые выводят цепочку внутри своего содержимого. */
const OWN_BREADCRUMB_PAGES = [
  "/reviews",
  "/orders",
  "/zepb-registry",
  "/user-agreement",
  "/privacy-policy",
  "/personal-data-consent",
  "/offer",
  "/requisites",
  "/register",
  "/training/defectoscopist-certification",
];

/** Первая ссылка цепочки в кабинете. */
const PROFILE: BreadcrumbItem = {
  label: "Профиль",
  href: "/settings",
};

/** Отзывы об исполнителях — родитель для страниц отдельного исполнителя. */
const EXPERT_REVIEWS: BreadcrumbItem = {
  label: "Отзывы об исполнителях",
  href: "/expert-reviews",
};

/** Определяет страницы, которые сами выводят цепочку, в том числе с названием из API. */
export function hasOwnBreadcrumbs(path: string): boolean {
  const publicPath = path.replace(/^\/landing(?=\/)/, "");

  return OWN_BREADCRUMB_PAGES.includes(publicPath)
    || isPostsPage(publicPath)
    || /^\/(blog|news|rtn)(\/[^/]+)?$/.test(publicPath)
    || /^\/order\/[^/]+$/.test(publicPath)
    || /^\/labor\/listing\/[^/]+$/.test(publicPath);
}

/** Строит цепочку страниц кабинета или направления; null — цепочка не нужна. */
export function getPageBreadcrumbs(pathname: string): BreadcrumbItem[] | null {
  const path = pathname.replace(/\/$/, "") || "/";

  if (ROOT_PAGES.includes(path) || hasOwnBreadcrumbs(path)) {
    return null;
  }

  if (path === "/customer/orders/new") {
    return [
      PROFILE,
      {
        label: "Заказы",
        href: "/customer/orders",
      },
      {
        label: "Создать заказ",
      },
    ];
  }

  const cabinetPage = CABINET_PAGES.find((page) => page.path === path);

  if (cabinetPage) {
    return [
      PROFILE,
      {
        label: cabinetPage.label,
      },
    ];
  }

  if (/^\/chat\/[^/]+$/.test(path)) {
    return [
      PROFILE,
      {
        label: "Чат по заказам",
        href: "/chat",
      },
      {
        label: "Диалог",
      },
    ];
  }

  if (/^\/expert\/reviews\/[^/]+$/.test(path)) {
    return [
      PROFILE,
      EXPERT_REVIEWS,
      {
        label: "Отзывы об исполнителе",
      },
    ];
  }

  if (/^\/experts\/[^/]+\/orders$/.test(path)) {
    return [
      PROFILE,
      EXPERT_REVIEWS,
      {
        label: "История заказов исполнителя",
      },
    ];
  }

  const servicePath = path.replace(/^\/(landing\/)?/, "");
  const servicePage = SERVICE_PAGES.find((page) => page.path === servicePath);

  if (!servicePage) {
    return null;
  }

  return [
    {
      label: "Главная",
      href: path.startsWith("/landing/") ? "/landing" : "/",
    },
    {
      label: servicePage.label,
    },
  ];
}
