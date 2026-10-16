/** Количество новостей в серверной странице списка. */
export const NEWS_PAGE_SIZE = 24;

/** Размер страницы блога и клиентской порции статей в обоих разделах. */
export const BLOG_PAGE_SIZE = 12;

/** Направления для фильтра опубликованных новостей и статей. */
export const ARTICLE_DIRECTION_OPTIONS = [
  {
    value: "",
    label: "Все направления",
  },
  {
    value: "EXPERTISE",
    label: "Экспертиза промбезопасности",
  },
  {
    value: "AUDIT_SUPB",
    label: "Аудит СУПБ",
  },
  {
    value: "TECH_DIAG",
    label: "Техдиагностирование и НК",
  },
  {
    value: "DESIGN",
    label: "Проектирование",
  },
  {
    value: "SURVEY",
    label: "Инженерные изыскания",
  },
  {
    value: "ECOLOGY",
    label: "Экология",
  },
  {
    value: "RESEARCH",
    label: "НИР и лаборатории",
  },
  {
    value: "CADASTRAL",
    label: "Кадастровые работы",
  },
  {
    value: "FORENSIC",
    label: "Судебная экспертиза",
  },
];
