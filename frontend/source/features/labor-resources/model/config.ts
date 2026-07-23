import type { LaborPageCopy, LaborPageMode } from "./types";

export const LABOR_PAGE_COPY: Record<LaborPageMode, LaborPageCopy> = {
  license: {
    title: "Поиск эксперта в штат",
    subtitle:
      "Найдите эксперта для постоянной работы, получения лицензии или проверки лицензионных требований",
    browseTab: "Организации ищут экспертов",
    ownKind: "EXPERT_WANTED",
    browseKind: "EXPERT_WANTED",
    formTitle: "Создать заявку на поиск эксперта",
  },
  expert: {
    title: "Готов к трудовому договору",
    subtitle:
      "Сообщите экспертным организациям, что готовы рассмотреть трудоустройство",
    browseTab: "Эксперты готовы к трудоустройству",
    ownKind: "EXPERT_AVAILABLE",
    browseKind: "EXPERT_AVAILABLE",
    formTitle: "Опубликовать готовность к трудоустройству",
  },
};
