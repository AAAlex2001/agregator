export interface PageBreadcrumbItem {
  label: string;
  href?: string;
}

const services: Record<string, string> = {
  "audit-supb": "Аудит СУПБ",
  "tehnicheskoe-diagnostirovanie": "Техническое диагностирование",
  "sudebnaya-ekspertiza": "Судебная экспертиза",
  nir: "НИР и лабораторные исследования",
  ekologiya: "Экологическое сопровождение предприятий",
  "ekspertiza-promyshlennoy-bezopasnosti": "Экспертиза промышленной безопасности",
  "kadastrovye-raboty": "Кадастровые работы",
  proektirovanie: "Проектирование",
  "inzhenernye-izyskaniya": "Инженерные изыскания",
  "expert-contacts": "Контакты исполнителей",
};

const cabinet: Record<string, string> = {
  "/customer/orders": "Все заказы",
  "/customer/reports": "Отчёты",
  "/expert/orders": "Все заказы",
  "/expert/reviews": "Отзывы обо мне",
  "/expert-reviews": "Отзывы об исполнителях",
  "/expert/hazard": "Оценка опасности",
  "/expert/lining": "Оценка крепи",
  "/expert/room": "Чат исполнителей",
  "/labor/expert-search": "Поиск исполнителя в штат",
  "/labor/employment": "Готов к трудовому договору",
  "/responses": "Мои отклики",
  "/archive": "Архив",
  "/chat": "Чат по заказам",
  "/support": "Поддержка",
  "/notifications": "Уведомления",
  "/tech-expert": "Техэксперт",
};

// Эти страницы выводят крошки внутри контента, в том числе название из API.
export function hasContentBreadcrumbs(pathname: string): boolean {
  const path = pathname.replace(/^\/landing(?=\/)/, "");
  return /^\/(blog|news|rtn)(\/[^/]+)?$/.test(path)
    || /^\/(reviews|orders|zepb-registry|user-agreement|privacy-policy|personal-data-consent|offer|requisites|register)$/.test(path)
    || path === "/training/defectoscopist-certification"
    || /^\/order\/[^/]+$/.test(path)
    || /^\/labor\/listing\/[^/]+$/.test(path);
}

export function getPageBreadcrumbs(pathname: string): PageBreadcrumbItem[] | null {
  const path = pathname.replace(/\/$/, "") || "/";
  if (hasContentBreadcrumbs(path)) return null;
  if (path === "/" || path === "/landing" || path === "/settings") return null;
  const profile = { label: "Профиль", href: "/settings" };
  if (cabinet[path]) return [profile, { label: cabinet[path] }];
  if (/^\/chat\/[^/]+$/.test(path)) {
    return [profile, { label: cabinet["/chat"], href: "/chat" }, { label: "Диалог" }];
  }
  if (/^\/expert\/reviews\/[^/]+$/.test(path)) {
    return [profile, { label: cabinet["/expert-reviews"], href: "/expert-reviews" }, { label: "Отзывы об исполнителе" }];
  }
  if (/^\/experts\/[^/]+\/orders$/.test(path)) {
    return [profile, { label: cabinet["/expert-reviews"], href: "/expert-reviews" }, { label: "История заказов исполнителя" }];
  }
  const service = services[path.replace(/^\/(landing\/)?/, "")];
  return service ? [
    { label: "Главная", href: path.startsWith("/landing/") ? "/landing" : "/" },
    { label: service },
  ] : null;
}
