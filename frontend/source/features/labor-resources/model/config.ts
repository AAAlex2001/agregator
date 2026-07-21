import type { LaborPageCopy, LaborPageMode } from "./types";

export const LABOR_PAGE_COPY: Record<LaborPageMode, LaborPageCopy> = {
  license: {
    title: "Поиск эксперта в штат",
    subtitle:
      "Найдите эксперта для постоянной работы, получения лицензии или проверки лицензионных требований",
    browseTab: "Заявки экспертов",
    ownKind: "EXPERT_WANTED",
    browseKind: "EXPERT_AVAILABLE",
    formTitle: "Создать заявку на поиск эксперта",
  },
  expert: {
    title: "Готов к трудовому договору",
    subtitle:
      "Сообщите экспертным организациям, что готовы рассмотреть трудоустройство",
    browseTab: "Поиск экспертов",
    ownKind: "EXPERT_AVAILABLE",
    browseKind: "EXPERT_WANTED",
    formTitle: "Опубликовать готовность к трудоустройству",
  },
};
